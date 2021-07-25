//dash off 
//faces-main face
face[0] = {
	offms: 10000, //5 sec timeout
	g:w.gfx,
	spd:[],
	init: function(){
		//if (!euc.dash.maker) {face.go((face.appPrev=="dashGarage")?"main":"dashGarage",0);return;}
        // if (!face.appPrev.startsWith("dash")) this.g.clear();
        this.g.setColor(0,0);
		this.g.fillRect(0,0,239,239);
		this.g.setColor(1,col("white"));
		this.g.setFont("Vector",20);
		this.g.drawString(euc.dash.maker,120-(this.g.stringWidth(euc.dash.maker)/2),217); 
		this.g.flip(); 
       // this.btn(1,euc.dash.trpL,35,60,60,col("raf2"),col("red"),0,50,119,95);			
       // this.btn(1,euc.dash.spdM,38,48,110,col("dgray"),col("red"),0,100,95,145);			
        //this.btn(1,euc.dash.spdA,38,48,160,col("dgray"),col("red"),0,150,95,195);				
        //this.btn(1,euc.dash.bat+"%",38,185,10,col("raf1"),col("red"),122,0,239,45);	
        //this.btn(1,euc.dash.time,38,185,60,col("dgray"),col("red"),122,50,239,95);			
        //this.btn(1,euc.dash.trpL,38,172,110,col("dgray"),col("red"),100,100,239,145);			
        //this.btn(1,euc.dash.trpT,38,172,160,col("dgray"),col("red"),100,150,239,195);			
		this.g.setColor(0,0);
		this.g.fillRect(0,75,239,155);
		this.g.setColor(1,col("lblue"));
		//logDay
		this.log=require("Storage").readJSON("logDay.json",1);
		this.hr=Date().getHours();
  	this.btn(1,(this.log[this.hr])?this.log[this.hr].toFixed(2):0,35,120,170,1365,1365,0,160,249,239);	
    this.pos=this.hr;
		for (let i = 0; i < 24; i++) {
			let h=(this.hr-i<0)?24+(this.hr-i):this.hr-i;
			w.gfx.fillRect(237-(i*10),(this.log[h])?150-this.log[h]:150, 237-((i*10)+8),150);		
			this.g.flip(); 
		}

	},
	show : function(o){
		if (!this.run) return;
  		//refresh 
		this.tid=setTimeout(function(t){
			t.tid=-1;
			t.show();
		},150,this);
	},
    btn: function(bt,txt1,size1,x1,y1,clr1,clr0,rx1,ry1,rx2,ry2,txt2,size2,x2,y2){
			this.g.setColor(0,(bt)?clr1:clr0);
			this.g.fillRect(rx1,ry1,rx2,ry2);
			this.g.setColor(1,col("white"));
			this.g.setFont("Vector",size1);	
          this.g.drawString(txt1,x1-(this.g.stringWidth(txt1)/2),y1); 
   			if (txt2){this.g.setFont("Vector",size2);	
            this.g.drawString(txt2,x2-(this.g.stringWidth(txt2)/2),y2);}
			this.g.flip();
    },
    ntfy: function(txt1,txt0,size,clr,bt){
            this.g.setColor(0,clr);
			this.g.fillRect(0,198,239,239);
			this.g.setColor(1,col("white"));
			this.g.setFont("Vector",size);
     		this.g.drawString((bt)?txt1:txt0,120-(this.g.stringWidth((bt)?txt1:txt0)/2),214); 
			this.g.flip();
			if (this.ntid) clearTimeout(this.ntid);
			this.ntid=setTimeout(function(t){
                t.ntid=0;
				t.g.setColor(0,0);
				t.g.fillRect(0,196,239,239);
				t.g.setColor(1,col("white"));
				t.g.setFont("Vector",20);
		        t.g.drawString(euc.dash.maker,120-(t.g.stringWidth(euc.dash.maker)/2),217); 
				t.g.flip();

			},1000,this);
    },
	tid:-1,
	run:false,
	clear : function(){
		//if (face.appCurr!="dash_simple" || face.pageCurr!=0) this.g.clear();
		this.run=false;
		if (this.tid>=0) clearTimeout(this.tid);
		this.tid=-1;
		return true;
	},
	off: function(){
		this.g.off();
		this.clear();
	} 
};
//loop face
face[1] = {
	offms:1000,
	init: function(){
	return true;
	},
	show : function(){
		face.go("main",0);
		return true;
	},
	clear: function(){
		return true;
	},
	off: function(){
		return true;
	},
};	

//touch-main
touchHandler[0]=function(e,x,y){
	switch (e) {
	case 5: //tap event
		if (160 <y ) {
			if  ( 120 < x ) {
				face[0].pos++;
				while (!face[0].log[face[0].pos]) {
 					face[0].pos++;
					if (24<face[0].pos) face[0].pos=0;
				}
			}else if ( x < 120 ){
				face[0].pos--;
				while (!face[0].log[face[0].pos]) {
 					face[0].pos--;
					if (face[0].pos< 0) face[0].pos=23;

				}
			}
			print("pos :",face[0].pos);
			face[0].btn(1,face[0].pos+"-"+(face[0].pos+1)+((face[0].pos>12)?" PM":" AM"),25,120,165,1365,1365,0,160,249,239,face[0].log[face[0].pos].toFixed(2),40,120,205);
			digitalPulse(D16,1,[30,50,30]);
		}else 
			digitalPulse(D16,1,40);
		this.timeout();
		break;
    case 1: //slide down event
		face.go("main",0);
		return;
    case 2: //slide up event
		if (y>160&&x<50) {
			if (w.gfx.bri.lv!==7) {this.bri=w.gfx.bri.lv;w.gfx.bri.set(7);}
			else w.gfx.bri.set(this.bri);
			digitalPulse(D16,1,[30,50,30]);
			this.timeout();
		}else if (Boolean(require("Storage").read("settings"))) {face.go("settings",0);return;}
        this.timeout();
		break;
    case 3: //slide left event
		face.go("dashGarage",0);
		return;
    case 4: //slide right event (back action)
		face.go("main",0);
		return;
    case 12: //touch and hold(long press) event
		digitalPulse(D16,1,40);
		this.timeout();
		return;
    }
};