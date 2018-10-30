/* ES6 Required */
/* Module of CustomObject (Redesigned) */
class TPtr{
    constructor(item,prev=null,next=null){
        if(typeof(prev)===typeof(TPtr)){
            prev.next=this;
        }
    }
    destructor(){
        //if next node exist
        if(typeof(next)===typeof(TPtr)){next.prev=prev;}
        //if prev node exist
        if(typeof(prev)===typeof(TPtr)){prev.next=next;}
        delete this;
    }
}
class CustomObject{
    constructor(name,x,y,z,width,height,depth,zIndex,imgSrc,isEventTransparent){
        this.name=name;
        this.x=x;
        this.y=y;
        this.width=width;
        this.z=z;
        this.height=height;
        this.depth=depth;
        this.zIndex=zIndex;
        this.imgSrc=imgSrc;
        this.imgData=null;
        this.isEventTransparent=(isEventTransparent==true?true:false);
        this.callee=undefined;
        this.ondraw=((cs)=>{
            console.log("Drawing");
            console.log("trying to load "+this.name+ " 's " + this.imgSrc + " image source file.");
            let _img_left=this.x-this.width/2;
            let _img_top=this.y-this.height/2;
            if(this.imgData==null || this.imgData == undefined){
                if(this.callee!==undefined){
                    let _img_data=new Image();
                    _img_data.src=this.imgSrc;
                    this.callee.customResourceManager.add(_img_data);
                    this.imgData=this.callee.customResourceManager.findImageBySourceName(this.imgSrc);
                }
                else{
                    let _img_data = new Image();
                 _img_data.src=this.imgSrc;
                    this.imgData = _img_data;
                }
                
            }
            cs.context.drawImage(this.imgData,_img_left,_img_top,this.width,this.height);
            cs.context.strokeRect(_img_left, _img_top, this.width, this.height);
            console.log("Drawing Done.");
        }).bind(this)
    }
    onDraw(cs){
        //if(typeof(this.ondraw)==typeof(Function))
        if(true){
            console.log("onDraw :: this : " + this);
            console.log("onDraw :: is Drawing? " + cs + " from " + this.name );
            (this.ondraw.bind(this))(cs);
        }
    }
}
class CustomScreen{
    constructor(canvasElement){
        this.setCanvas(canvasElement);
        this.context=this.canvas.getContext("2d");
        this.waitDrawingObjects=[];
        /* Mapped Related By this Position */
        this.orthoWidth = 1280;
        this.orthoHeight = 720;
        this.orthoDepth = 640;
        
        this.orthoLeft = -1.0;
        this.orthoRight = 1.0;
        this.orthoTop = -1.0;
        this.orthoBottom = 1.0;
        this.orthoFront = -1.0;
        this.orthoBack = 1.0;
    }
    setCanvas(canvasElement){
        this.canvas=canvasElement;
        if(typeof(canvasElement)=="string")
            this.canvas=document.getElementById(canvasElement);
        console.log(this.canvas);
        return this.canvas;
    }
    requestPaint(){
        for(let i=0; i<arguments.length;i++)
            this.addDrawingObject(arguments[i]);
        this.paint();
        console.log("Draw Finished");
    }
    addDrawingObject(){
        for(let i=0; i<arguments.length;i++)
            this.waitDrawingObjects.push(arguments[i]);
    }
    paint(){
        console.log("Drawings : " + this.waitDrawingObjects + " from " + this.context);
        if(this.waitDrawingObjects.length>0){
            this.waitDrawingObjects.forEach((function(e){
                console.log("paint 1 :: " + this);
                console.log("paint 2 :: " + this.context);
                (e.onDraw.bind(e))(this);
                console.log(e.name);
            }).bind(this));
            this.waitDrawingObjects.splice(0,this.waitDrawingObjects.length);
        }
    }
    
}
class CustomObjectGroup extends Array{
    constructor(){
        super();
        this.name=name;
    }
    setName(name){
        this.name=name;
    }
}
class CustomResourceManager{
    constructor(){
        this.customObjects_front=null;
        this.customObjects_back=null;
        this.etcs_front=null;
        this.etcs_back=null;
        this.images=[];
        this.sounds=[];
    }
    destructor(){

    }
    add(item){
        function appendNode(_item,_nodes_back){
            let tPtr = new TPtr(_item,_nodes_back);
            _nodes_back=tPtr;
        }
        if(typeof(item)==typeof(CustomObject)){
            appendNode(item,customObjects_back);
        }
        else if(item.constructor== new Image().constructor){
            this.images.push(item);
            console.log("CRMan:: added Image \"" + item.src + "\"");
        }
        else if(item.constructor==new Audio().constructor){
            this.sounds.push(item);
            console.log("CRMan:: added Audio.");
        }
        else{
            appendNode(item,etcs_back);
        }
    }
    findImageBySourceName(url){
        return this.images.find((e)=>{return (url == e.src);});
    }
    append(){
        this.add.bind(this);
    }
}
class CustomObjectManager{
    constructor(canvasElement){
        this.customScreen = new CustomScreen(canvasElement);
        canvasElement.addEventListener("contextmenu",(e)=>{e.preventDefault();window.full});
        this.customResourceManager = new CustomResourceManager();
        this.customObjects=[];
        this.h_onmove=null;
        this.onmove=function(){
            this.requestPaint();
            console.log("run!");
        }
    }
    requestPaint(){
        this.customScreen.requestPaint();
    }
    startLoadScreen(){
        if(this.h_onmove!=null){
            clearInterval(this.h_onmove);
            this.h_onmove=null;
        }
        this.h_onmove=setInterval((this.onmove).bind(this),1000);
    }
    run(){
        
    }
    destructor() {
        delete this.customScreen;
        delete this.customResourceManager;
        delete this.customObjects;
    }
    addObject(obj){
        this.customObjects.push(obj);
        this.customScreen.requestPaint(obj);
        return obj;
    }
    addCustomObject(name,x,y,z,width,height,depth,zIndex,imgSrc, isEventTransparent){
        let _customObject= new CustomObject(name,x,y,z,width,height,depth,zIndex,imgSrc, isEventTransparent);
        _customObject.callee=this;
        return this.addObject(_customObject);
    }
    removeObject(obj){
        this.customObjects.pop(obj);
        return obj;
    }
    parseJSONObject(url){
        /*ref from https://developer.mozilla.org/ko/docs/XMLHttpRequest */
        var req = new XMLHttpRequest();
        req.open('GET', url,true);
        req.onreadystatechange = function(evt){
            if(req.readyState == 4){
                if(req.status==200){
                    objs = JSON.parse(req.responseText);
                    console.log(objs);
                }
                else
                    console.log("Error loading page\n");
            }
        };
        req.send(null);
    }
}

