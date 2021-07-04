
E.setConsole(Serial1,{force:true}); //0000 devmode
function bcon() {
   console.log("in",Bluetooth.read());
    Bluetooth.on('data',ccon);
	/*emuMon=setInterval(() => { 
		let btin=Bluetooth.read();
		if (btin) {
			print (btin);
		}	
	}, 100);
	*/
}
function bdis() {
    Bluetooth.removeListener('data',ccon);
	//if (emuMon) { clearInterval(emuMon);emuMon=0;}
}
function ccon(l){ 
    line=l;
	print(line);
	if (l=="U\xAA\3\x11\1\x1A\2\xCE\xFF"){
		print(1,line,l.charCodeAt(0));
	}
	else if  (l=="Z\xA5\1>\x14\1\x1A\2\x8F\xFF"){ //firmware
///		print(2,line,l.charCodeAt(0));
	 	Bluetooth.write([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x1a,0x07,0x11,0x75,0xff]); //repl3
		print("firmware");
	}
	else if  (l=="Z\xA5\1>\x14\1\xB0\x20\xDB\xFE"){//live
		Bluetooth.write([0x5a,0xa5,0x20,0x14,0x3e,0x04,0xb0,0x00,0x00,0x00,0x00,0x48,0x98,0x00,0x00,0x41,0x00,0x00,0x00,0x00,0x00,0x18,0x38,0x25,0x00,0x00,0x00,0x3b,0x00,0xbe,0x00,0xa2,0x14,0x08,0x00,0x00,0x00,0x00,0x00,0x8c,0xfb]);
		print("live");
	}
	else if  (l=="Z\xA5\1>\x14\1\x68\2\x41\xFF"){ //start
		Bluetooth.write([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x68,0x01,0x01,0x3d,0xff]); //start
		print("start");
	}
	else if  (l=="Z\xA5\1>\x14\1\x10\x0e\x8d\xFF"){ //info
		Bluetooth.write([0x5a,0xa5,0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x4f,0x54,0x43,0x31,0x38,0x33,0x33,0x54,0x30,0x30,0x33,0x38,0x36,0xfc]); //model info
		print("model info");
	}
	else if  (l=="Z\xA5\1>\x14\1\x66\6\x3f\xFF"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x06,0x14,0x3e,0x04,0x66,0x17,0x01,0x17,0x01,0x01,0x01,0x0b,0xff]);
		print("unk1");
	}
	else if  (l=="Z\xA5\0>\x16\x5b\0\x50\xFF"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x10,0x16,0x3e,0x5b,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x08,0xe5,0x2a,0x82,0x7b,0x56,0x20,0x3a,0x54,0xf6,0x32,0xfb]);
//		Bluetooth.write([0x5a,0xa5,0x10,0x16,0x3e,0x5b,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x08,0xe5,0x2a,0x82,0x7b,0x56,0x20]);
//		Bluetooth.write([0x3a,0x54,0xf6,0x32,0xfb]);		
		print("unk2");
	}	
	else if  (l=="Z\xA5\1>\x14\1\x10\x0E\x8D\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x47,0xb1,0x69,0xb3,0x43,0x65,0x13,0x6e,0x64,0xc6,0x33,0x38,0x36,0xfc]);
//		Bluetooth.write([0x5a,0xa5,0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x47,0xb1,0x69,0xb3,0x43,0x65,0x13,0x6e,0x64,0xc6,0x33]);
//		Bluetooth.write([0x38,0x36,0xfc]);		
		print("unk3");
	}	
	else if  (l=="Z\xA5\1>\x14\1\xD2\x04\xD5\xF6"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x04,0x14,0x3e,0x04,0xd2,0x00,0x00,0x12,0xe5,0x93,0x7c]);
		print("unk4");
	}	
	else if  (l=="Z\xA5\1>\x14\1\xC6\x02\xE3\xF6"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x02,0x14,0x3e,0x04,0xc6,0x01,0x00,0xe8,0x1b]);
		print("unk5");
	}
	else if  (l=="Z\xA5\1>\x14\1\xF5\x02\xB4\xF6"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x02,0x14,0x3e,0x04,0xf5,0xe2,0x03,0xc5,0x18]);
		print("unk6");
	}	
	else if  (l=="Z\xA5\1>\x14\1\x7c\x08\x27\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x08,0x14,0x3e,0x04,0x7c,0x04,0x00,0x24,0xe4,0xfa,0x85,0xef,0x47,0x58,0xc7]);
		print("unk6");
	}
	else if  (l=="Z\xA5\1>\x14\1\x72\x06\x33\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x06,0x14,0x3e,0x04,0x72,0x00,0x00,0x28,0xab,0x3a,0xa5,0xf7,0xa8]);
		print("unk7");
	}	
	else if  (l=="Z\xA5\1>\x14\1\x69\x02\x40\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x69,0x5c,0x26,0xb4,0x1b]);
		print("unk8");
	}
	else if  (l=="Z\xA5\1>\x11\1\x10\x1a\x84\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x1a,0x11,0x3e,0x04,0x10,0x34,0x39,0x51,0xa0,0x7b,0xb3,0x43,0x1e,0x11,0x6b,0x64,0xc5,0x30,0x30,0x17,0x01,0x80,0x25,0x88,0xc0,0xc6,0x91,0x3d,0x56,0x87,0x3a,0xb6,0x0e]);
//		Bluetooth.write([0x5a,0xa5,0x1a,0x11,0x3e,0x04,0x10,0x34,0x39,0x51,0xa0,0x7b,0xb3,0x43,0x1e,0x11,0x6b,0x64,0xc5,0x30]);
//		Bluetooth.write([0x30,0x17,0x01,0x80,0x25,0x88,0xc0,0xc6,0x91,0x3d,0x56,0x87,0x3a,0xb6,0x0e]);
		print("unk9");
	}
	else if  (l=="Z\xA5\1>\x11\1\x3b\x02\x71\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x02,0x11,0x3e,0x04,0x3b,0x62,0x00,0x05,0x1a]);
		print("unk10");
	}
	else if  (l=="Z\xA5\1>\x11\1\x20\x02\x8c\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x02,0x11,0x3e,0x04,0x20,0x01,0x25,0x6c,0x1a]);
		print("unk11");
	}
	else if  (l=="Z\xA5\1>\x12\1\x10\x1a\x83\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x1a,0x12,0x3e,0x04,0x10,0x34,0x39,0x51,0xa0,0x7b,0xb3,0x43,0x1e,0x11,0x6b,0x64,0xc5,0x30,0x30,0x17,0x01,0x80,0x25,0x88,0xc0,0xc6,0x91,0x38,0x56,0x87,0x3a,0xb0,0x0e]);
//		Bluetooth.write([0x5a,0xa5,0x1a,0x12,0x3e,0x04,0x10,0x34,0x39,0x51,0xa0,0x7b,0xb3,0x43,0x1e,0x11,0x6b,0x64,0xc5,0x30]);
//		Bluetooth.write([0x30,0x17,0x01,0x80,0x25,0x88,0xc0,0xc6,0x91,0x38,0x56,0x87,0x3a,0xb0,0x0e]);
		print("unk12");
	}
	else if  (l=="Z\xA5\1>\x12\1\x3b\x02\x70\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x02,0x12,0x3e,0x04,0x3b,0x62,0x00,0x04,0x1a]);
		print("unk13");
	}
	else if  (l=="Z\xA5\1>\x12\1\x20\x02\x8b\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x02,0x12,0x3e,0x04,0x20,0x01,0x25,0x6b,0x1a]);
		print("unk14");
	}
	else if  (l=="Z\xA5\1>\x14\1\xb0\x20\xdb\xF6"){ //live1
		Bluetooth.write([0x5a,0xa5,0x20,0x14,0x3e,0x04,0xb0,0x00,0x00,0x08,0xe5,0x62,0x1a,0x7b,0x56,0x1e,0x3a,0x54,0xf6,0xc2,0x03,0x82,0x82,0x29,0x00,0x08,0xe5,0x03,0x82,0x09,0x57,0x5c,0x2e,0x51,0xf6,0x00,0x00,0xc2,0x03,0xd3,0xf9]);
//		Bluetooth.write([0x5a,0xa5,0x20,0x14,0x3e,0x04,0xb0,0x00,0x00,0x08,0xe5,0x62,0x1a,0x7b,0x56,0x1e,0x3a,0x54,0xf6,0xc2]);
//		Bluetooth.write([0x03,0x82,0x82,0x29,0x00,0x08,0xe5,0x03,0x82,0x09,0x57,0x5c,0x2e,0x51,0xf6,0x00,0x00,0xc2,0x03,0xd3]);
//		Bluetooth.write([0xf9]);
		print("unk15-live1");
	}
	else if  (l=="Z\xA5\1>\x14\1\x25\x0c\x7a\xF7"){ //live2
		Bluetooth.write([0x5a,0xa5,0x0c,0x14,0x3e,0x04,0x25,0xf0,0x15,0x08,0xe5,0xd2,0x93,0x7b,0x56,0xa2,0xb8,0x7d,0xf6,0x3d,0xfc]);
//		Bluetooth.write([0x5a,0xa5,0x0c,0x14,0x3e,0x04,0x25,0xf0,0x15,0x08,0xe5,0xd2,0x93,0x7b,0x56,0xa2,0xb8,0x7d,0xf6,0x3d]);
//		Bluetooth.write([0xfc]);
		print("unk16-live2");
	}
	else if  (l=="Z\xA5\1>\x14\1\x61\x04\x46\xF7"){ //live3
		Bluetooth.write([0x5a,0xa5,0x04,0x14,0x3e,0x04,0x61,0x00,0x00,0x08,0xe5,0x6e,0x7d]);
		print("unk17-live3");
	}
	else if  (l=="Z\xA5\1>\x14\1\x3e\x02\x6b\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x3e,0x8a,0x01,0xd6,0x1b]);
		print("unk18");
	}
	else if  (l=="Z\xA5\1>\x14\1\x43\x0a\x5e\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x0a,0x14,0x3e,0x04,0x43,0x72,0x01,0x08,0xe5,0x2a,0x82,0x7b,0x56,0x5d,0x2e,0x0c,0x08]);
		print("unk19");
	}
	else if  (l=="Z\xA5\1>\x14\1\xd2\x04\xd5\xF6"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x04,0x14,0x3e,0x04,0xd2,0x00,0x00,0x12,0xe5,0x93,0x7c]);
		print("unk20");
	}
	else if  (l=="Z\xA5\1>\x11\1\x30\x0e\x70\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x0e,0x11,0x3e,0x04,0x30,0x01,0x00,0xd0,0xf2,0x15,0x82,0x7b,0x56,0xb4,0x2e,0x63,0xc0,0x00,0x20,0x0a,0xfd]);
//		Bluetooth.write([0x5a,0xa5,0x0e,0x11,0x3e,0x04,0x30,0x01,0x00,0xd0,0xf2,0x15,0x82,0x7b,0x56,0xb4,0x2e,0x63,0xc0,0x00]);
//		Bluetooth.write([0x20,0x0a,0xfd]);
		print("unk21");
	}
	else if  (l=="Z\xA5\1>\x11\1\x40\x1e\x50\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x1e,0x11,0x3e,0x04,0x40,0xa2,0x0e,0xae,0xeb,0x8d,0x8c,0xdc,0x58,0x86,0x34,0xe3,0xf8,0xbd],0x0e,0xba,0x0e,0xbd,0x0e,0xb5,0xeb,0x92,0x8c,0xc2,0x58,0xe1,0x34,0x95,0xf8,0x00,0x00,0xb3,0xf4);
//		Bluetooth.write([0x5a,0xa5,0x1e,0x11,0x3e,0x04,0x40,0xa2,0x0e,0xae,0xeb,0x8d,0x8c,0xdc,0x58,0x86,0x34,0xe3,0xf8,0xbd]);
//		Bluetooth.write([0x0e,0xba,0x0e,0xbd,0x0e,0xb5,0xeb,0x92,0x8c,0xc2,0x58,0xe1,0x34,0x95,0xf8,0x00,0x00,0xb3,0xf4]);
		print("unk22");
	}
	else if  (l=="Z\xA5\1>\x12\1\x30\x0e\x6f\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x0e,0x12,0x3e,0x04,0x30,0x01,0x00,0x88,0xf2,0x14,0x82,0x7e,0x56,0xac,0x2e,0x62,0xc3,0x00,0x00,0x87,0xfd]);
//		Bluetooth.write([0x5a,0xa5,0x0e,0x12,0x3e,0x04,0x30,0x01,0x00,0x88,0xf2,0x14,0x82,0x7e,0x56,0xac,0x2e,0x62,0xc3,0x00]);
//		Bluetooth.write([0x00,0x87,0xfd]);
		print("unk23");
	}
	else if  (l=="Z\xA5\1>\x12\1\x40\x1e\x4f\xF7"){ //unknown
		Bluetooth.write([0x5a,0xa5,0x1e,0x12,0x3e,0x04,0x40,0xa7,0x0e,0x93,0xeb,0x8b,0x8c,0xd7,0x58,0x88,0x34,0xe5,0xf8,0xb2,0x0e,0xaf,0x0e,0xb5,0x0e,0xba,0xeb,0x85,0x8c,0xcc,0x58,0x96,0x34,0xec,0xf8,0x00,0x00,0x05,0xf5]);
//		Bluetooth.write([0x5a,0xa5,0x1e,0x12,0x3e,0x04,0x40,0xa7,0x0e,0x93,0xeb,0x8b,0x8c,0xd7,0x58,0x88,0x34,0xe5,0xf8,0xb2]);
//		Bluetooth.write([0x0e,0xaf,0x0e,0xb5,0x0e,0xba,0xeb,0x85,0x8c,0xcc,0x58,0x96,0x34,0xec,0xf8,0x00,0x00,0x05,0xf5]);
		print("unk24");
	}
	else {
		print(4,"rest",line,Bluetooth.read());
		la=1;
		Bluetooth.write([0x5a,0xa5,0x20,0x14,0x3e,0x04,0xb0,0x00,0x00,0x08,0xe5,0x62,0x1a,0x7b,0x56,0x1e,0x3a,0x54,0xf6,0xc2,0x03,0x82,0x82,0x29,0x00,0x08,0xe5,0x03,0x82,0x09,0x57,0x5c,0x2e,0x51,0xf6,0x00,0x00,0xc2,0x03,0xd3,0xf9]);
    }
}
NRF.on('disconnect',bdis);  
NRF.on('connect',bcon);