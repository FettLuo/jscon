
// Copyright 2021 fyter.cn/fett
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
	constructor(opt){
		if(window.con_impl)return
        this.ver="v1.2"
		window.con_impl=this
		var dc=function(name,option){
			var t=document.createElement(name)
			if(option){
				if(option.text)t.textContent=option.text
				if(option.html)t.innerHTML=option.html
				if(option.child)t.append(option.child)
				if(option.children)for(var c of option.children)t.append(c)
				if(option.style)t.setAttribute("style",option.style)
			}
            t.style.border=t.style.margin=t.style.padding="0"
			return t
		}
		var gfx=dc("canvas").getContext("2d")
		gfx.font="10px sans-serif"
		var timer,focus=false,tipsel
		var hisix=0
		var his=this.history=[]
		var wnd=this.wnd=dc("div",{style:"max-height:"+(opt&&opt.height?opt.height:"300px")+";overflow-y:auto"})
		var ctrl=this.wnd=dc("div",{style:"position:absolute;right:0;display:flex;top:0;pointer:default"})
		var minbtn=this.wnd=dc("div")
		var closebtn=this.wnd=dc("div",{text:"x"})
		var openbtn=this.wnd=dc("div",{text:"^"})
		var note=this.wnd=dc("div",{text:">"})
		var tip=this.wnd=dc("div",{style:"position:absolute;background-color:#333;bottom:20px;left:9.648;border:1px solid #555;padding:1px;max-height:200px;overflow-y:auto;"})
		var input=this.wnd=dc("input",{style:"width:100%;border:0;background-color:#0000;color:#fff;flex-grow:1;outline:none;font:10px sans-serif"})
		var cmd=this.wnd=dc("div",{children:[note,tip,input],style:"display:flex"})
		var main=this.main=this.wnd=dc("div",{children:[wnd,cmd,ctrl],style:"position:fixed;bottom:0;min-height:20px;text-shadow:#000 1px 1px;right:0;left:0;color:white;font-size:small"})
        if(opt&&opt.bgcolor)main.style.backgroundColor=opt.bgcolor
        input.setAttribute("spellcheck","false")
		tip.style.display="none"
		document.body.appendChild(main)
		function trie(obj,search){
			if(!obj)return
			var matchs=new Set()
			for(var k in obj){
                var pos=k.toLowerCase().indexOf(search.toLowerCase())
                if(pos==-1)continue
                var r=k.substr(0,pos)+"<b>"+k.substr(pos,search.length)+"</b>"+k.substr(pos+search.length)
                matchs.add(r)
            }
			for(var k of Object.getOwnPropertyNames(obj.__proto__)){
                var pos=k.toLowerCase().indexOf(search.toLowerCase())
                if(pos==-1)continue
                var r=k.substr(0,pos)+"<b>"+k.substr(pos,search.length)+"</b>"+k.substr(pos+search.length)
                matchs.add(r)
            }
			return matchs
		}
		var autohide=_=>{
			if(!opt||!opt.autohide)
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
				if(tipsel){
					tipsel.click()
					return
				}
				try{
					log("> "+input.value)
					var s=eval(input.value)
					log(s)
					if(!(his.length>0&&his[his.length-1]==input.value))
						his.push(input.value)
					input.value=""
					input.focus()
				}catch(err){
					log(err)
				}
			}
		}
		input.oninput=_=>{
			tip.style.display="none"
			tipsel=null
			if(input.value=="")return
			var m=input.value.match(/([$_\w]+[$_\w\d]*\.?)+$/)
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
							var t=dc("div",{html:m})
							t.onclick=function(){
								var pos=input.value.lastIndexOf(".")
								if(pos>-1)input.value=input.value.substr(0,pos+1)+this.textContent
								else input.value=this.textContent
								this.parentNode.style.display="none"
								tipsel=null
								input.focus()
							}
							tip.append(t)
						}
						if(matchs.size>0){
							tipsel=tip.firstElementChild
							tipsel.style.backgroundColor="#00e"
							tipsel.style.color="white"
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
            if(_.keyCode==9){event.preventDefault()}
			if(tipsel){
				switch(_.keyCode){
                    case 27://esc
                    case 8://backspace
                        tipsel.parentNode.style.display="none"
                        tipsel=null
						event.preventDefault()
                        break
					case 38:
						if(tipsel.previousElementSibling){
							tipsel.style.backgroundColor="inherit"
							tipsel.style.color="inherit"
							tipsel=tipsel.previousElementSibling
							tipsel.style.backgroundColor="#00e"
							tipsel.style.color="white"
                            tipsel.scrollIntoView()
						}
						event.preventDefault()
						break
					case 40:
						if(tipsel.nextElementSibling){
							tipsel.style.backgroundColor="inherit"
							tipsel.style.color="inherit"
							tipsel=tipsel.nextElementSibling
							tipsel.style.backgroundColor="#00e"
							tipsel.style.color="white"
                            tipsel.scrollIntoView()
						}
						event.preventDefault()
						break
                    case 9:
                        tipsel.click()
                        break
				}
			}else{
                switch(_.keyCode){
                    case 8:
                        if(his.length>0&&input.selectionEnd==input.selectionStart&&input.selectionEnd==0){
                            hisix++
                            if(hisix>his.length){
                                hisix--
                                input.value=""
                            }else{
                                input.value=his[his.length-hisix]
                                input.selectionEnd=0
                            }
                        }else if(input.selectionEnd==input.selectionStart&&input.selectionEnd>0){
                            input.value=input.value.substr(0,input.value.length-1)
                        }
						event.preventDefault()
                        break
                }
            }
			if(input.value==""){
				if(his.length==0)return
				switch(_.keyCode){
					case 38:hisix++;if(hisix>his.length)hisix--;input.value=his[his.length-hisix];event.preventDefault();break
					case 40:hisix--;if(hisix<0)hisix=0;input.value=his[his.length-hisix];event.preventDefault();break
					default:hisix=0;break
				}
			}
		}
		window.log=function(){
			var line=dc("div")
			line.textContent=[...arguments].join(" ")
            line.onclick=_=>{
                if(line.textContent.substr(0,2)=="> ")
                    input.value=line.textContent.substr(2)
                else
                    input.value=line.textContent
                input.focus()
            }
			wnd.appendChild(line)
			autohide()
			wnd.lastElementChild.scrollIntoView()
		}
		window.onerror=function(err,url,no){
			log(err+" - "+url)
		}
		setInterval(_=>{
			for(var i=0;i<wnd.childElementCount-5000;i++){
				wnd.firstChild.remove()
			}
		},1000)
	}
}