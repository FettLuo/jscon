
// Copyright [yyyy] [name of copyright owner]
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
// 	 http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
class con{
	constructor(){
		if(window.con_impl)return
		window.con_impl=this
		var dc=function(name,option){
			var t=document.createElement(name)
			if(option){
				if(option.text)t.textContent=option.text
				if(option.child)t.append(option.child)
				if(option.children)for(var c of option.children)t.append(c)
				if(option.style)t.setAttribute("style",option.style)
			}
			return t
		}
		var gfx=dc("canvas").getContext("2d")
		gfx.font="10px sans-serif"
		var timer,focus=false
		var hisix=0
		var his=this.history=[]
		var wnd=this.wnd=dc("div")
		var ctrl=this.wnd=dc("div",{style:"position:absolute;right:0;display:flex;top:0;pointer:default"})
		var minbtn=this.wnd=dc("div")
		var closebtn=this.wnd=dc("div",{text:"x"})
		var openbtn=this.wnd=dc("div",{text:"^"})
		var note=this.wnd=dc("div",{text:">"})
		var tip=this.wnd=dc("div",{style:"position:absolute;background-color:#333;bottom:20px;left:9.648;border:1px solid #555;padding:1px;max-height:200px;overflow-y:auto;"})
		var input=this.wnd=dc("input",{style:"width:100%;border:0;background-color:#0000;color:#fff;flex-grow:1;outline:none;font:10px sans-serif"})
		var cmd=this.wnd=dc("div",{children:[note,tip,input],style:"display:flex"})
		var main=this.main=this.wnd=dc("div",{children:[wnd,cmd,ctrl],style:"position:fixed;bottom:0;min-height:22px;text-shadow: #000 1px 1px;right:0;left:0;color:white;font-size:small"})
		document.body.appendChild(main)
		function trie(obj,search){
			if(!obj)return
			var keys=Object.getOwnPropertyNames(obj)
			var matchs=[]
			for(var k of keys)if(k.substr(0,search.length)==search)matchs.push(k)
			return matchs
		}
		var autohide=_=>{
			if(timer){clearTimeout(timer);timer=null}
			if(focus)return
			timer=setTimeout(_=>{wnd.style.display="none"}, 3000)
		}
		input.onfocus=_=>{
			focus=true
			wnd.style.display="block"
			if(timer){clearTimeout(timer);timer=null}
		}
		input.onblur=_=>{
			focus=false
			autohide()
		}
		input.onkeypress=_=>{
			if(_.keyCode==13){
				try{
					log("> "+input.value)
					var s=eval(input.value)
					log(s)
					if(!(his.length>0&&his[his.length-1]==input.value))
						his.push(input.value)
					input.value=""
				}catch(err){
					log(err)
				}
			}
		}
		input.oninput=_=>{
			tip.style.display="none"
			if(input.value=="")return
			var m=input.value.match(/[$_a-zA-Z]+[$_a-z0-9.]*$/)
			if(!m)return
			tip.innerHTML=""
			var frags=m[0].split(".")
			var last=frags.length-1
			var curobj=window
			try{
				for(var i=0;i<frags.length;i++){
					if(last==i){
						var matchs=trie(curobj,frags[i])
						for(var m of matchs){
							var t=dc("div",{text:m})
							t.onclick=function(){
								var pos=input.value.lastIndexOf(".")
								if(pos>-1)input.value=input.value.substr(0,pos+1)+this.textContent
								else input.value=this.textContent
								this.parentNode.style.display="none"
							}
							tip.append(t)
						}
						if(matchs.length>0){
							tip.style.display="block"
							tip.style.left=(gfx.measureText(input.value).width+9.648)+"px"
						}
					}else{
						curobj=curobj[frags[i]]
					}
				}
			}catch{}
		}
		input.onkeydown=_=>{
			if(input.value==""){
				if(his.length==0)return
				switch(_.keyCode){
					case 38:hisix++;if(hisix>his.length)hisix--;input.value=his[his.length-hisix];event.preventDefault();break
					case 40:hisix--;if(hisix<0)hisix=0;input.value=his[his.length-hisix];event.preventDefault();break
					default:hisix=0;break
				}
			}
		}
		openbtn.onpointerdown=_=>{
		}
		closebtn.onpointerdown=_=>{
		}
		window.log=function(){
			var line=dc("div")
			line.textContent=[...arguments].join(" ")
			wnd.appendChild(line)
			autohide()
		}
		setInterval(_=>{
			for(var i=0;i<logm.childElementCount-5000;i++){
				logm.firstChild.remove()
			}
		},1000)

	}
}
onload=function(){
	document.body.onpointerdown=_=>{
		document.body.style.backgroundColor="#"+Math.random().toString().substr(2,6)
	}
	new con()
	for(var i=0;i<30;i++)
		log(Math.random())
}