//Vteran euc module 
//euc.conn(euc.mac);
//euc.wri("lightsOn")
//commands
euc.cmd=function(no){
	switch (no) {
		case "beep":return [98]; 
		case "rideSoft":return "SETs"; 
		case "rideMed":return  "SETm"; 
		case "rideHard":return "SETh";
		case "setLightOn":return "SetLightON";
		case "setLightOff":return "SetLightOFF";
		case "setVolUp":return "SetFctVol+";
		case "setVolDn":return "SetFctVol-";
		case "clearMeter":return "CLEARMETER";
    }
};
//start
euc.conn=function(mac){
	//check
	if ( global["\xFF"].BLE_GATTS!="undefined") {
		if (set.def.cli) print("ble allready connected"); 
		if (global["\xFF"].BLE_GATTS.connected) {global["\xFF"].BLE_GATTS.disconnect();return;}
	}
	//connect 
	NRF.connect(mac,{minInterval:7.5, maxInterval:15})
	.then(function(g) {
	   return g.getPrimaryService(0xffe0);
	}).then(function(s) {
	  return s.getCharacteristic(0xffe1);
	//read
	}).then(function(c) {
		this.need=0;
		c.on('characteristicvaluechanged', function(event) {
			this.event=new Uint8Array(event.target.value.buffer);
			euc.alert=0;
			//print(this.event);
			if  ( this.event[0]===220 && this.event[1]===90 && this.event[2]===92 ) {
				//print("primary packet");
				//volt-bat
				euc.dash.volt=(this.event[4]  << 8 | this.event[5] )/100;
				euc.dash.bat = Math.round(((euc.dash.volt / 24) * 100 - 310 ) * 0.905);
				batL.unshift(euc.dash.bat);
				if (20<batL.length) batL.pop();
				batL.unshift(euc.dash.bat);
				if (20<batL.length) batL.pop();
				euc.dash.batC = (50 <= euc.dash.bat)? 0 : (euc.dash.bat <= euc.dash.batL)? 2 : 1;	
				if ( euc.dash.hapB && euc.dash.batC ==2 )  euc.alert ++;   
				//spd
				euc.dash.spd=(this.event[6] << 8 | this.event[7]) / 10;
				if (euc.dash.spdM < euc.dash.spd) euc.dash.spdM = euc.dash.spd;
				euc.dash.spdC = ( euc.dash.spd <= euc.dash.spd1 )? 0 : ( euc.dash.spd2 <= euc.dash.spd )? 2 : 1 ;	
				if ( euc.dash.hapS && euc.dash.spdC == 2 ) 
					euc.alert = 1 + Math.round((euc.dash.spd-euc.dash.spd2) / euc.dash.ampS) ; 
				//trip
				euc.dash.trpL=(this.event[10] << 24 | this.event[11] << 16 | this.event[8] << 8  | this.event[9])/1000;
				euc.dash.trpT=(this.event[14] << 24 | this.event[15] << 16 | this.event[12] << 8  | this.event[13])/1000;
				euc.log.trp.forEach(function(val,pos){ if (!val) euc.log.trp[pos]=euc.dash.trpT;});
				//amp
				euc.dash.amp=event.target.value.getInt16(16)/100;
				if (euc.dash.ampR) euc.dash.amp=-euc.dash.amp;				
					ampL.unshift(euc.dash.amp);
					if (20<ampL.length) ampL.pop();
				euc.dash.ampC = ( euc.dash.ampH <= euc.dash.amp || euc.dash.amp <= euc.dash.ampL )? 2 : ( euc.dash.amp  <= 0 || 15 <= euc.dash.amp)? 1 : 0;
				if (euc.dash.hapA) euc.alert =  euc.alert + 1 + Math.round( (euc.dash.amp - euc.dash.ampH) / euc.dash.ampS) ;
				//tmp
				euc.dash.tmp=(this.event[18] << 8 | this.event[19])/100;
				euc.dash.tmpC=(euc.dash.tmpH - 5 <= euc.dash.tmp )? (euc.dash.tmpH <= euc.dash.tmp )?2:1:0;
				if (euc.dash.hapT && euc.dash.tmpC==2) euc.alert++;
			} else {
				//print(this.event);
				//print("secondary packet");
				//euc.dash.off=(this.event[0] << 8 | this.event[1]);
				//euc.dash.chrg=(this.event[2] << 8 | this.event[3]);
				//euc.dash.spd1=((this.event[4] << 8 | this.event[5]) / 10)|0;
				//euc.dash.spdT=((this.event[6] << 8 | this.event[7]) / 10)|0;
				if (!euc.dash.model) euc.dash.model=(this.event[8] << 8 | this.event[9]);
				euc.dash.mode=(this.event[10] << 8 | this.event[11]);
			}
			//alerts
			if (euc.alert && !euc.buzz) {  
				euc.buzz=1;
				if (w.gfx.isOn) face.off(10000);
				if (20<=euc.alert) euc.alert=20;
				var a=[];
				while (5 <= euc.alert) {
					a.push(150,500);
					euc.alert=euc.alert-5;
				}
				var i;
				for (i = 0; i < euc.alert ; i++) {
					a.push(150,150);
				}
				digitalPulse(D16,0,a);  
				setTimeout(() => {euc.buzz=0; }, 3000);
			}
			//screen on
			if ((1<euc.dash.spdC||1<euc.dash.ampC||euc.dash.alrm)&&!w.gfx.isOn ){
				face.go(set.dash[set.def.dash.face],0);
			}
		});
		//on disconnect
		global["\u00ff"].BLE_GATTS.device.on('gattserverdisconnected', function(reason) {
		euc.off(reason);
		});
		return  c;
	//write
	}).then(function(c) {
		console.log("EUC Veteran connected!!"); 
		euc.wri= function(n) {
            //console.log("got :", n);
			if (euc.busy) { clearTimeout(euc.busy);euc.busy=setTimeout(()=>{euc.busy=0;},150);return;} 
			euc.busy=setTimeout(()=>{euc.busy=0;},1000);
            //end
			if (n=="hornOn") {
				euc.horn=1;
				let md={"1":"SETs","2":"SETm","3":"SETh"};
				c.writeValue(md[euc.dash.mode]).then(function() { 
					c.stopNotifications();
					setTimeout(() => {
						c.writeValue((euc.dash.light)?"SetLightOFF":"SetLightON").then(function() {
							setTimeout(() => { 
								c.writeValue((euc.dash.light)?"SetLightON":"SetLightOFF").then(function() {	
									setTimeout(() => {
										if (euc.busy) { clearTimeout(euc.busy);euc.busy=0;} 
										if (BTN1.read()) euc.wri("hornOn");
										else {euc.horn=0;c.startNotifications();}
									},30); 	
								});
							},30);
						});	
					},30);
				});
			}else if (n=="hornOff") {
				euc.horn=0;
			}else if (euc.state=="OFF"||n=="end") {
               c.stopNotifications(); 
				if (euc.kill) {clearTimout(euc.kill);euc.kill=0;}
				//setTimeout(()=>{
				c.writeValue(euc.cmd("beep")).then(function() {
					return c.writeValue(euc.cmd("setLightOff"));
				}).then(function()  {
					global["\xFF"].BLE_GATTS.disconnect();if (set.def.cli) console.log("EUC Veteran out");
				}).catch(function(err)  {
					global["\xFF"].BLE_GATTS.disconnect();if (set.def.cli) console.log("EUC Veteran out");
				});
				//},300);
            }else if (euc.cmd(n)) {
				c.writeValue(euc.cmd(n)).then(function() {
					if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
				}).catch(function(err)  {
					if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
					euc.off("err");
				});
			}else if (set.def.cli) {
				c.writeValue(n).then(function() {
					if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
				});
				console.log("no command :",n,", sending raw");
			}
		};
		if (!set.read("dash","slot"+set.read("dash","slot")+"Mac")) {
			euc.dash.mac=euc.mac; 
			euc.updateDash(require("Storage").readJSON("dash.json",1).slot);
			set.write("dash","slot"+set.read("dash","slot")+"Mac",euc.mac);
		}
		c.startNotifications();
		setTimeout(() => {euc.busy=0;euc.state="READY";digitalPulse(D16,1,[100,100,150,]);euc.wri((euc.dash.light)?"setLightOn":"beep");}, 500);
		//setTimeout(() => {euc.wri("beep");euc.state="READY";}, 500);

	//reconect
	}).catch(function(err)  {
		euc.off(err);
	});
};
//catch
euc.off=function(err){
	if (euc.reconnect) {
		clearTimeout(euc.reconnect);
		euc.reconnect=0;
	}
	if (euc.state!="OFF") {
        euc.seq=1;
		if (set.def.cli) 
			console.log("EUC: Restarting");
		if ( err==="Connection Timeout"  )  {
			if (set.def.cli) console.log("reason :timeout");
			euc.state="LOST";
			if (euc.dash.lock==1) digitalPulse(D16,1,250);
			else digitalPulse(D16,1,[250,200,250,200,250]);
			euc.reconnect=setTimeout(() => {
				euc.reconnect=0;
				euc.conn(euc.mac); 
			}, 5000);
		}
		else if ( err==="Disconnected"|| err==="Not connected")  {
			if (set.def.cli) console.log("reason :",err);
			euc.state="FAR";
			euc.reconnect=setTimeout(() => {
				euc.reconnect=0;
				euc.conn(euc.mac); 
			}, 500);
		}
		else {
			if (set.def.cli) console.log("reason :",err);
			euc.state="RETRY";
			euc.reconnect=setTimeout(() => {
				euc.reconnect=0;
				euc.conn(euc.mac); 
			}, 1000);
		}
	} else {
		if (set.def.cli) console.log("EUC OUT:",err);
		if (euc.horn) {clearInterval(euc.horn);euc.horn=0;}
		global["\xFF"].bleHdl=[];
		if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
		euc.off=function(err){if (set.def.cli) console.log("EUC off, not connected",err);};
		euc.wri=function(err){if (set.def.cli) console.log("EUC write, not connected",err);};
		euc.conn=function(err){if (set.def.cli) console.log("EUC conn, not connected",err);};
		euc.cmd=function(err){if (set.def.cli) console.log("EUC cmd, not connected",err);};
		NRF.setTxPower(set.def.rfTX);	
    }
};

