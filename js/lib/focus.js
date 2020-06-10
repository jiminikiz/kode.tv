define(function () {
    var _ = require('underscore');

    function Focus () {
        this.index = {};
    }

    Focus.prototype = {
        init: function(scope,selector){
          //init takes scope as a param since its called externally
          var id=scope.tabindex||scope.cid||_.uniq('nav'), i=0, element;

          index[id]=scope;
          scope.tabindex=id;

          if(selector===undefined){
            element=scope.$el;
          } else if(typeof selector=='string'){
            element=scope.$el.find(selector).first();
          } else if(typeof selector=='object'){
            // assuming an array of nodes
            // selector = $('.collection');...
            // selector = document.querySelectorAll('.collection');
            // for(i=0;i<selector.length;i++) {
            //   element=selector[i];
            //   element.setAttribute('tabindex',id++);
            //   element.setAttribute('nav_item',true);
            //   index[id]={
            //     view:scope,
            //     element: element,
            //     index:id
            //   };
            // }
            // return index;
            element=$(selector);
          } else{
            console.error("Can't init nav item.");
          }
          element.attr('tabindex',id);
          element.attr('nav_item',true);
          return index[id];
      },
      go: function(event){
          // console.debug(this);
          event.preventDefault();
          // event.stopPropagation();
          if(!stateData.appScope){
            stateData.appScope=this;
          }
          stateData.localScope=undefined;
          if(Backbone.Focus.locked||window.navHandled===true){
            // console.warn('locked:', Backbone.Focus.locked);
            // console.warn('navHandled:', window.navHandled);
            return null;
          }
          var options = {}, // todo add defaults
              active, activeIndex,
              items, container, view, i,
              key = Config.keymap[event.keyCode];

          if(stateData.appScope.navigate.useFocus||App.scope.navigate.useFocus===undefined){
            active=event.target;
          } else {
            active=stateData.active;
          }
          activeIndex=$(active).attr('tabindex');
          if(index[activeIndex]){
            view=index[activeIndex];
            stateData.localScope=view;
            // console.debug(view);
          }
          if(this.navigate && this.navigate.rules){//add global navigation rules //todo traverse parents?
            this.navigate.rules.map(function(rule,index){
              if(typeof rule=='string'){
                this.navigate.rules[index]=helper.initRule.call(this,rule,view);
              }
            },this);
            _.extend(options,this.navigate);
          }
          if(view&&view.navigate){ //nav item is a member of a view
            if(view.navigate.rules){
              view.navigate.rules.map(function(rule,index){
                if(typeof rule=='string'){
                  view.navigate.rules[index]=helper.initRule.call(this,rule,view);
                }
              },this);
            }
            _.extend(options,view.navigate);
          }

          if(view&&view.navigate&&this.navigate){
            for(i in view.navigate){
              if(view.navigate.hasOwnProperty(i)&&_.isArray(this.navigate[i])){
                options[i]=_.union(view.navigate[i],this.navigate[i]);
              }
            }
          }

          helper.applyRules.call(stateData.appScope,'onStart',options.rules,function(){
            if(key && options[key]){ // an action exists for this key in the navigate object of the view
              switch(typeof options[key]) {
                case 'function': return options[key].call(view, active, key);
                case 'string':
                  if( view && typeof view[options[key]]=='function' ){
                    return view[options[key]](active, key);// this is a method of the attached view
                  } else if( typeof this[options[key]]=='function' ) {
                    return this[options[key]](active, key);//this is a method of the top level view
                  } else {
                    console.error('missing action for '+ key);
                    return false;
                  }
                break;
                default:
                  console.error('dunno what to do!'); // wat?
                  return false;
              }
            } else {
              container = helper.findParentContainer($(active));

              if(container!==null && container.length) {
                if(key=='up'||key=='right'||key=='left'||key=='down') {
                  return helper.findMatch.call(view, active, container, key ,function (best) {
                    methods.select.call(stateData.appScope,best,active,options);
                  },options);
                } else {
                  container = null;
                  // todo add hook
                  if (Config.keymap[event.keyCode]=='select' && active.hash!==undefined){
                    location=active.hash;
                  }
                }
              } else {
                if(stateData.lastActive){//selecting last active
                  methods.select.call(stateData.appScope,stateData.lastActive,active,options);
                } else {
                  var selection = $('.active');
                  if( selection.length ){
                    methods.select.call(stateData.appScope,selection.first()[0],active,options);
                  } else {
                    // no parent container
                    methods.select.call(stateData.appScope,$('[nav=true] [nav_item=true]').first()[0],active,options);
                  }
                  selection = null;
                }
                return false;
                // todo later-- this is a dumb edge case anyways~
              }
            }
            return null; // this should never happen
          },(view||stateData.appScope),key);
          return null; //this should never happen
        };
        select: function(selection,old,options){
          if(!selection) {
            return null;
          }
          if(selection.jquery){
            selection=selection[0];
          }
          if(old && old.jquery){
            old=old[0];
          }
          [old,selection].map(function (item,i){
            if(item && item.hasAttribute && !item.hasAttribute('nav_item')){
              item=$(item).find('[nav_item]');
              if(!item.length){
                item = $('[nav_item]');
              } else{
                item=$('[nav_item]');
              }
              return item[0];
            } else {
              return item;
            }
          },this);
          stateData.active=selection;
          //Backbone.Focus.active=stateData.active;
          stateData.lastActive=old;
          //Backbone.Focus.lastActive=stateData.lastActive;
          if(options===undefined){
            options={};
          }

          return helper.applyRules.call(stateData.appScope,'onNavigate',options.rules,function(toContinue){
            if(toContinue!==false){
              methods.focus.call(this,stateData.active);
              if(stateData.lastActive && stateData.lastActive!==stateData.active){
                $(stateData.lastActive).removeClass('active');
              }
              $(stateData.active).addClass('active');
            }
          },
          index[(selection&&selection.hasAttribute&&selection.hasAttribute('tabindex')?selection.attributes.tabindex.value:null)]||stateData.appScope,
          {
            lastActive : stateData.lastActive,
            active     : stateData.active
          });
        };
        unselect = function(el) {
          // console.debug('called');
          $(el).removeClass('active');
        };
    };
    methods.focus=function(el){
      if( stateData.appScope && stateData.appScope.navigate.useFocus ) {
          el.focus();
      }
      stateData.activeElement=el;
    };
    methods.enable=function(selector, tabindex, selectable) {
      if(!tabindex) {
        tabindex = this.tabindex || App.scope.tabindex || null;
      }
      if(selectable === undefined) {
        selectable = true;
      }
      if( selector && tabindex ) {
        $(selector)
            .attr('tabindex', tabindex)
            .attr('nav_item', selectable);
      } else {
        console.warn("Can't enable elements: " + tabindex + " " + selector);
      }
    };

    helper.initRule=function(rule,scope){
      var checkScope = function(rule,scope){
        if(Backbone.Focus.rules[rule]&&scope.navigate&&scope.navigate.rules&&(_.indexOf(scope.navigate.rules,rule)!=-1)){
          return true;
        }
        return false;
      };
      if(scope!==undefined && checkScope.call(this,rule,scope)){
        return new Backbone.Focus.rules[rule](scope); //todo typecheck
      } else if(checkScope.call(this,rule,this)){
        if(scope===undefined){
          scope=this;
        }
        return new Backbone.Focus.rules[rule](this); //todo typecheck
      }
      else{
        return rule;
      }
    };

    return {
      init:methods.init,
      setScope:methods.setScope,
      go:methods.go,
      select:methods.select,
      unselect:methods.unselect,
      focus:methods.focus,
      enable:methods.enable,
      rules:rules,
      locked:false,
      state:stateData,
      index:index,
      // elems:stateData
      // active:stateData.active,
      // lastActive:stateData.lastActive,
      active:function(E){
        if(E) {
          stateData.activeElement = null;
          stateData.activeElement = E;
        }
        return stateData.activeElement;
      },
      lastActive:function(E){
        if(E) {
          stateData.lastActive = null;
          stateData.lastActive = E;
        }
        return stateData.lastActive;
      },
      localScope: function(scope) {
        if(scope) {
          stateData.localScope = null;
          stateData.localScope = scope;
        }
        return stateData.localScope;
      }
    };
  })();

  return Backbone.Focus;
});
