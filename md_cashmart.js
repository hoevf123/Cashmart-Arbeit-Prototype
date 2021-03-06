/* Cashmart Arbeit Independent Running Module */
/* This Source Requires ES6 Specifications!! */
/* File Created 2018-09-13 by "Day of Bishop (DongYeong Kim)" */


class Product{
    constructor(_productName,_imgSrc){
        this.name=_productName;
        this.imgSrc=_imgSrc;
    }
}
class Npc{
    constructor(_npcName,_imgSrc){
        this.name=_npcName;
        this.imgSrc=_imgSrc;
    }
}

/* used for npc-product sets relationships */
class NpcRequires{
    constructor(_npc, ..._Products){
        this.npc=_npc;
        this.requiredProduct=[];
        if(_Products.length>1){
            for(let idx_arg=0;idx_arg<_Products.length;idx_arg++){
                let foundProduct = findProductByName(_Products[idx_arg]);
                if(foundProduct instanceof Product)
                    this.requiredProduct.push(foundProduct);
            }
        }    
    }
}


/* this class is used for gaming */
class CashMart_Customer{
    constructor(_Npc,_requiredProduct=null,_isRequiringProduct=false){
        this.npc=((_Npc instanceof Npc)?_Npc:null);
        this.requiredProduct=((_requiredProduct instanceof Product)?_requiredProduct:null);
        this.isRequiringProduct=_isRequiringProduct;
    }
}


class Maple2CashMart{
    constructor(){
        this.stages=[1,2,3];
        this.idx_currentStage=0;
        this.products=[];
        this.npcs=[];
        this.npcRequires=[];
    }
    appendNpcs(){
        Array.prototype.forEach.call(arguments,(element) => {
            if(element instanceof Array) this.npcs.push(new Npc(element[0],element[1]));
        });
    }
    appendProducts(){
        Array.prototype.forEach.call(arguments,element => {
            if(element instanceof Array) this.products.push(new Product(element[0],element[1]));
        });
    }
    appendNpcRequires(){
        Array.prototype.forEach.call(arguments,(element) => {
            if(element instanceof Array){
                let _found_npc = this.findNpcByName(element[0]);
                if(_found_npc.constructor === Npc){
                    let _created_npcRequires = new NpcRequires(_found_npc);
                    if(2 <= element.length){
                        element.slice(1).forEach((e)=>{
                            let _created_product = this.findProductByName(e);
                            if(_created_product!=null){
                                if(_created_product.constructor === Product){
                                    _created_npcRequires.requiredProduct.push(_created_product);
                                }
                            }
                            
                        });
                    }
                    this.npcRequires.push(_created_npcRequires);
                    
                }
            } 
        });
    }
    findNpcRequireByNpc(_Npc){
        return (this.npcRequires.find((e)=>{
            console.log("compare : " + e + " and " + _Npc + "\n" );
            if(!(e instanceof Npc));
            else if(e.name === _Npc.name){
                return e;
            }
        }));
    }
    findProductByName(_Product_name){
        return (this.products.find((e)=>{
            if(!(e.constructor === Product));
            else if(e.name === _Product_name)
                return e;
        }));
    }
    findNpcByName(_Npc_name){
        return (this.npcs.find((e)=>{
            if(!(e.constructor === Npc));
            else if(e.name === _Npc_name)
                return e;
        }));
    }
    reset(){
        
    }
    destructor(){
        delete this;
    }
    enrollCustomer(){

    }
    
}