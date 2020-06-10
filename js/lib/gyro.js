define(function() {
    return {
        // returns the center point of the edge
        getEdge: function( item, direction ) {
            var offset=item.offset(),
                size= helper.getSize(item);

            switch( direction ){
                case 'up': return {
                    left:offset.left+(size.width*0.5),
                    top:offset.top
                };
                case 'right': return {
                    left:offset.left+size.width,
                    top:offset.top+(size.height*0.5)
                };
                case 'down': return {
                    left:offset.left+(size.width*0.5),
                    top:offset.top+size.height
                };
                case 'left':
                return {
                    left:offset.left,
                    top:offset.top+(size.height*0.5)
                };
                default: console.error('must specify edge'); break;
            }
        },
        getSize: function( item ){
            return {
                width:item.outerWidth(),
                height:item.outerHeight()
            };
        },
        getDistance: function( active, candidate ){
            return Math.sqrt(Math.pow(Math.abs(active.top-candidate.top),2)+Math.pow(Math.abs(active.left-candidate.left),2));
        },
        opposite: function( direction ) {
            switch( direction ) {
                case 'up':    return 'down';
                case 'right': return 'left';
                case 'down':  return 'up';
                case 'left':  return 'right';

                default: return console.error('must specify edge');
          }
      },
      findMatch: function( active, container, direction, cb,passedOptions ){
            var options = _.extend({}, passedOptions);
            if( options.selector===undefined ){
                options.selector='[nav_item=true]';
            }
            if(!active.jquery){
                active=$(active);
            }
            var items = $(container).first().find(options.selector),//an array of all the candidates
                candidateFace = helper.oppositeOf(direction),
                best, item, candidateEdge, distance, i, handled;

                active=[active,helper.getEdge(active,direction)];

            for(i=0;i<items.length;i++){
                item=items[i];
                if(active[0][0]!==item){
                    candidateEdge=helper.getEdge($(item),candidateFace);
                    distance=helper.getDistance(active[1],candidateEdge);

                    switch(direction){
                        case 'up':
                            if(candidateEdge.top<=active[1].top&&(best===undefined||best[1]>distance)){
                                best=[item,distance];
                            }
                        break;
                        case 'down':
                            if(candidateEdge.top>=active[1].top&&(best===undefined||best[1]>distance)){
                                best=[item,distance];
                            }
                        break;
                        case 'left':
                            if(candidateEdge.left<=active[1].left&&(best===undefined||best[1]>distance)){
                                best=[item,distance];
                            }
                        break;
                        case 'right':
                            if(candidateEdge.left>=active[1].left&&(best===undefined||best[1]>distance)){
                                best=[item,distance];
                        }
                        break;
                        default: break;
                    }
                }
            }

            if(best!==undefined){
                if($(best[0]).attr('nav')){
                    best=$(best[0]).find('[nav_item]').first();
                }
                if(cb){
                    cb.call(this,best[0]);
                }
            } else {
                active=active[0];
                helper.applyRules.call(stateData.appScope,'onBubble',options.rules,function(){
                    if( options.use_edge && options.use_edge.active == 'container' && (!active.attr('nav')) ){
                        active=helper.findParentContainer(active);
                    }
                    if( options.use_edge && options.use_edge.candidate == 'container' ){
                        options.selector='[nav=true]';
                    }

                    container = helper.findParentContainer(container);

                    if( active && container ){
                        helper.findMatch.call(this,active,container,direction,cb,options);
                    }
                }, this, direction);
            }
        },
        findParentContainer: function( container ){
            // util function; scope doesn't matter
            // nav = false :: only refers to going into a container
            return ( container ) ? container.parents('[nav]'):null;
        }
    };
});
