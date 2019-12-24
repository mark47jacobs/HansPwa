!function(t,e){"use strict";"function"==typeof define&&define.amd?define([],(function(){return t.BotUI=e(t)})):t.BotUI=e(t)}("undefined"!=typeof window?window:this,(function(t,e){"use strict";return function(e,o){if(o=o||{},!e)throw Error("BotUI: Container id is required as first argument.");if(!document.getElementById(e))throw Error("BotUI: Element with id #"+e+" does not exist.");if(!t.Vue&&!o.vue)throw Error("BotUI: Vue is required but not found.");var n,i,s,a={debug:!1,fontawesome:!0,searchselect:!0},c={},l=/!\(([^\)]+)\)/gim,u=/!\[(.*?)\]\((.*?)\)/gim,r=/\[([^\[]+)\]\(([^\)]+)\)(\^?)/gim;for(var b in t.Vue=t.Vue||o.vue,a)o.hasOwnProperty(b)&&(a[b]=o[b]);function v(t,e,o,n){return"<a class='botui-message-content-link' target='"+(n?"blank":"")+"' href='"+o+"'>"+e+"</a>"}function f(t,e){var o=document.createElement("script");o.type="text/javascript",o.src=t,e&&(o.onload=e),document.body.appendChild(o)}function d(t){m.action.addMessage&&c.message.human({delay:100,content:t}),m.action.show=!m.action.autoHide}t.Promise||"undefined"!=typeof Promise||o.promise||f("https://cdn.jsdelivr.net/es6-promise/4.1.0/es6-promise.min.js");var p={template:'<div class="botui botui-container" v-botui-container><div class="botui-messages-container"><div v-for="msg in messages" class="botui-message" :class="msg.cssClass" v-botui-scroll><transition name="slide-fade"><div v-if="msg.visible"><div v-if="msg.photo && !msg.loading" :class="[\'profil\', \'profile\', {human: msg.human, \'agent\': !msg.human}]"> <img :src="msg.photo" :class="[{human: msg.human, \'agent\': !msg.human}]"></div><div :class="[{human: msg.human, \'botui-message-content\': true}, msg.type]"><span v-if="msg.type == \'text\'" v-text="msg.content" v-botui-markdown></span><span v-if="msg.type == \'html\'" v-html="msg.content"></span> <iframe v-if="msg.type == \'embed\'" :src="msg.content" frameborder="0" allowfullscreen></iframe></div></div></transition><div v-if="msg.photo && msg.loading && !msg.human" :class="[\'profil\', \'profile\', {human: msg.human, \'agent\': !msg.human}]"> <img :src="msg.photo" :class="[{human: msg.human, \'agent\': !msg.human}]"></div><div v-if="msg.loading" class="botui-message-content loading"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div></div></div><div class="botui-actions-container"><transition name="slide-fade"><div v-if="action.show" v-botui-scroll><form v-if="action.type == \'text\'" class="botui-actions-text" @submit.prevent="handle_action_text()" :class="action.cssClass"><i v-if="action.text.icon" class="botui-icon botui-action-text-icon fa" :class="\'fa-\' + action.text.icon"></i> <input type="text" ref="input" :type="action.text.sub_type" v-model="action.text.value" class="botui-actions-text-input" :placeholder="action.text.placeholder" :size="action.text.size" :value=" action.text.value" :class="action.text.cssClass" required v-focus/> <button type="submit" :class="{\'botui-actions-buttons-button\': !!action.text.button, \'botui-actions-text-submit\': !action.text.button}"><i v-if="action.text.button && action.text.button.icon" class="botui-icon botui-action-button-icon fa" :class="\'fa-\' + action.text.button.icon"></i> <span>{{(action.text.button && action.text.button.label) || \'Go\'}}</span></button></form><form v-if="action.type == \'select\'" class="botui-actions-select" @submit.prevent="handle_action_select()" :class="action.cssClass"><i v-if="action.select.icon" class="botui-icon botui-action-select-icon fa" :class="\'fa-\' + action.select.icon"></i><v-select v-if="action.select.searchselect && !action.select.multipleselect" v-model="action.select.value" :value="action.select.value" :placeholder="action.select.placeholder" class="botui-actions-text-searchselect" :label="action.select.label" :options="action.select.options"></v-select><v-select v-else-if="action.select.searchselect && action.select.multipleselect" multiple v-model="action.select.value" :value="action.select.value" :placeholder="action.select.placeholder" class="botui-actions-text-searchselect" :label="action.select.label" :options="action.select.options"></v-select> <select v-else v-model="action.select.value" class="botui-actions-text-select" :placeholder="action.select.placeholder" :size="action.select.size" :class="action.select.cssClass" required v-focus><option v-for="option in action.select.options" :class="action.select.optionClass" v-bind:value="option.value" :disabled="(option.value == \'\')?true:false" :selected="(action.select.value == option.value)?\'selected\':\'\'"> {{ option.text }}</option></select> <button type="submit" :class="{\'botui-actions-buttons-button\': !!action.select.button, \'botui-actions-select-submit\': !action.select.button}"><i v-if="action.select.button && action.select.button.icon" class="botui-icon botui-action-button-icon fa" :class="\'fa-\' + action.select.button.icon"></i> <span>{{(action.select.button && action.select.button.label) || \'Ok\'}}</span></button></form><div v-if="action.type == \'button\'" class="botui-actions-buttons" :class="action.cssClass"> <button type="button" :class="button.cssClass" class="botui-actions-buttons-button" v-botui-scroll v-for="button in action.button.buttons" @click="handle_action_button(button)"><i v-if="button.icon" class="botui-icon botui-action-button-icon fa" :class="\'fa-\' + button.icon"></i> {{button.text}}</button></div><form v-if="action.type == \'buttontext\'" class="botui-actions-text" @submit.prevent="handle_action_text()" :class="action.cssClass"><i v-if="action.text.icon" class="botui-icon botui-action-text-icon fa" :class="\'fa-\' + action.text.icon"></i> <input type="text" ref="input" :type="action.text.sub_type" v-model="action.text.value" class="botui-actions-text-input" :placeholder="action.text.placeholder" :size="action.text.size" :value="action.text.value" :class="action.text.cssClass" required v-focus/> <button type="submit" :class="{\'botui-actions-buttons-button\': !!action.text.button, \'botui-actions-text-submit\': !action.text.button}"><i v-if="action.text.button && action.text.button.icon" class="botui-icon botui-action-button-icon fa" :class="\'fa-\' + action.text.button.icon"></i> <span>{{(action.text.button && action.text.button.label) || \'Go\'}}</span></button><div class="botui-actions-buttons" :class="action.cssClass"> <button type="button" :class="button.cssClass" class="botui-actions-buttons-button" v-for="button in action.button.buttons" @click="handle_action_button(button)" autofocus><i v-if="button.icon" class="botui-icon botui-action-button-icon fa" :class="\'fa-\' + button.icon"></i> {{button.text}}</button></div></form></div></transition></div></div>',data:function(){return{action:{text:{size:30,placeholder:"Write here .."},button:{},show:!1,type:"text",autoHide:!0,addMessage:!0},messages:[]}},computed:{isMobile:function(){return t.innerWidth&&t.innerWidth<=768}},methods:{handle_action_button:function(t){for(var e=0;e<this.action.button.buttons.length;e++)if(this.action.button.buttons[e].value==t.value&&"function"==typeof this.action.button.buttons[e].event){if(this.action.button.buttons[e].event(t),this.action.button.buttons[e].actionStop)return!1;break}d(t.text);var o={type:"button",text:t.text,value:t.value};for(var n in t)t.hasOwnProperty(n)&&"type"!==n&&"text"!==n&&"value"!==n&&(o[n]=t[n]);s(o)},handle_action_text:function(){this.action.text.value&&(d(this.action.text.value),s({type:"text",value:this.action.text.value}),this.action.text.value="")},handle_action_select:function(){if(this.action.select.searchselect&&!this.action.select.multipleselect){if(!this.action.select.value.value)return;d(this.action.select.value[this.action.select.label]),s({type:"text",value:this.action.select.value.value,text:this.action.select.value.text,obj:this.action.select.value})}if(this.action.select.searchselect&&this.action.select.multipleselect){if(!this.action.select.value)return;for(var t=new Array,e=new Array,o=0;o<this.action.select.value.length;o++)t.push(this.action.select.value[o].value),e.push(this.action.select.value[o][this.action.select.label]);d(e.join(", ")),s({type:"text",value:t.join(", "),text:e.join(", "),obj:this.action.select.value})}else{if(!this.action.select.value)return;for(o=0;o<this.action.select.options.length;o++)this.action.select.options[o].value==this.action.select.value&&(d(this.action.select.options[o].text),s({type:"text",value:this.action.select.value,text:this.action.select.options[o].text}))}}}};t.Vue.directive("botui-markdown",(function(t,e){"false"!=e.value&&(t.innerHTML=t.textContent.replace(u,"<img class='botui-message-content-image' src='$2' alt='$1' />").replace(l,"<i class='botui-icon botui-message-content-icon fa fa-$1'></i>").replace(r,v))})),t.Vue.directive("botui-scroll",{inserted:function(t){i.scrollTop=i.scrollHeight,t.scrollIntoView(!0)}}),t.Vue.directive("focus",{inserted:function(t){t.focus()}}),t.Vue.directive("botui-container",{inserted:function(t){i=t}});var m=(n=new t.Vue({components:{"bot-ui":p}}).$mount("#"+e)).$children[0];function h(t){if(!t.loading&&!t.content)throw Error('BotUI: "content" is required in a non-loading message object.');t.type=t.type||"text",t.visible=!t.delay&&!t.loading;var e=m.messages.push(t)-1;return new Promise((function(o,n){setTimeout((function(){t.delay&&(t.visible=!0,t.loading&&(t.loading=!1)),o(e)}),t.delay||0)}))}function g(t){return"string"==typeof t&&(t={content:t}),t||{}}function x(t){if(!t.action&&!t.actionButton&&!t.actionText)throw Error('BotUI: "action" property is required.')}function y(t){return x(t),function(t,e){for(var o in t)e.hasOwnProperty(o)||(e[o]=t[o])}({type:"text",cssClass:"",autoHide:!0,addMessage:!0},t),m.action.type=t.type,m.action.cssClass=t.cssClass,m.action.autoHide=t.autoHide,m.action.addMessage=t.addMessage,new Promise((function(e,o){s=e,setTimeout((function(){m.action.show=!0}),t.delay||0)}))}return c.message={add:function(t){return h(g(t))},bot:function(t){return h(t=g(t))},human:function(t){return(t=g(t)).human=!0,h(t)},get:function(t){return Promise.resolve(m.messages[t])},remove:function(t){return m.messages.splice(t,1),Promise.resolve()},update:function(t,e){var o=m.messages[t];return o.content=e.content,o.visible=!e.loading,o.loading=!!e.loading,Promise.resolve(e.content)},removeAll:function(){return m.messages.splice(0,m.messages.length),Promise.resolve()}},c.action={show:y,hide:function(){return m.action.show=!1,Promise.resolve()},text:function(t){return x(t),m.action.text=t.action,y(t)},button:function(t){return x(t),t.type="button",m.action.button.buttons=t.action,y(t)},select:function(t){if(x(t),t.type="select",t.action.label=t.action.label||"text",t.action.value=t.action.value||"",t.action.searchselect=void 0!==t.action.searchselect?t.action.searchselect:a.searchselect,t.action.multipleselect=t.action.multipleselect||!1,t.action.searchselect&&"string"==typeof t.action.value)if(t.action.multipleselect){var e=t.action.value.split(",");for(t.action.value=new Array,n=0;n<t.action.options.length;n++)for(var o=0;o<e.length;o++)t.action.options[n].value==e[o]&&t.action.value.push(t.action.options[n])}else for(var n=0;n<t.action.options.length;n++)t.action.options[n].value==t.action.value&&(t.action.value=t.action.options[n]);return t.action.searchselect||t.action.options.unshift({value:"",text:t.action.placeholder}),m.action.button=t.action.button,m.action.select=t.action,y(t)},buttontext:function(t){return x(t),t.type="buttontext",m.action.button.buttons=t.actionButton,m.action.text=t.actionText,y(t)}},a.fontawesome&&f("https://use.fontawesome.com/ea731dcb6f.js"),a.searchselect&&f("https://unpkg.com/vue-select@2.4.0/dist/vue-select.js",(function(){Vue.component("v-select",VueSelect.VueSelect)})),a.debug&&(c._botApp=n),c}}));