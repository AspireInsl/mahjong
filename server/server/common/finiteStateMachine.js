var HashMap = require('hashmap');


class finiteStateMachine{
    constructor(){
        this.transitions=new HashMap();
        this.currentState="";
        this.states=new HashMap();
    }
    getCurrentState(){
        return this.currentState;
    }
    setInitialState(state){
        this.currentState=state;
    }
    addStateMethod(state,method){
        this.states.set(state,method);
    }
    addTransition(action,state){
        this.transitions.set(action,state);
    }
    process(action){
        if(!this.transitions.has(action)){
            return;
        }
        var state = this.transitions.get(action);
        if(!state){
            return;
        }
        if(!this.states.has(state)){
            return;
        }
        var method=this.states.get(state);
        this.currentState=state;
        if(!method){
            return;
        }     
        method();
    }
}

module.exports=finiteStateMachine;