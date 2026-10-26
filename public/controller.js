import {match,ensure,text} from './domain.js';
export function currentPool(state,id){
 const d=state?.data,pub=d?.publications.find(p=>p.id===id);const open=!!pub&&pub.archivedAt===null&&d.briefs.some(b=>b.id===pub.briefId&&b.archivedAt===null);
 const results=(d?.profiles||[]).filter(p=>p.archivedAt===null).map(p=>{const v=p.versions.at(-1);return {id:p.id,code:p.code,version:v.version,content:v.content,...match(pub?.content??{city:null,language:null,topics:[],topicsMode:'any'},v.content)};}).sort((a,b)=>a.code<b.code?-1:1);
 return {open,publication:pub??null,results};
}
export class SelectionDraft {
 constructor(){this.publicationId='';this.entries=new Map();this.open=false;this.committed=false;this.generation=0;this.pool=[];}
 start(id){this.publicationId=id;this.entries.clear();this.open=false;this.committed=false;this.generation++;}
 choose(row,checked){if(!checked){this.entries.delete(row.id);this.generation++;return;}ensure(this.open&&!this.committed&&row.eligible&&this.entries.size<5);this.entries.set(row.id,{id:row.id,code:row.code,version:row.version,reason:'',changed:false,available:true});this.generation++;}
 setReason(id,value){const e=this.entries.get(id);ensure(e&&typeof value==='string');e.reason=value;this.generation++;}
 reconcile(state,owner){const p=currentPool(state,this.publicationId);this.open=p.open;this.pool=p.results;this.committed=!!state?.data.shortlists.some(r=>r.publicationId===this.publicationId&&r.owner===owner);
  for(const entry of this.entries.values()){const row=p.results.find(r=>r.id===entry.id);entry.available=!!row?.eligible;entry.changed=!row||row.version!==entry.version;}
 }
 accept(id){const e=this.entries.get(id),row=this.pool.find(r=>r.id===id);ensure(this.open&&!this.committed&&e&&row?.eligible);e.version=row.version;e.changed=false;e.available=true;this.generation++;}
 get ready(){return this.open&&!this.committed&&this.entries.size>0&&this.entries.size<=5&&[...this.entries.values()].every(e=>{try{text(e.reason,500,true);return !e.changed&&e.available;}catch{return false;}});}
 payload(){ensure(this.ready);return {publicationId:this.publicationId,entries:[...this.entries.values()].map(e=>({profileId:e.id,version:e.version,reason:text(e.reason,500,true)}))};}
}
export class WorkspaceClient {
 constructor({fetch=globalThis.fetch.bind(globalThis),onChange=()=>{}}={}){this.fetch=fetch;this.onChange=onChange;this.user=null;this.state=null;this.users=[];this.unknown=null;this.draft=new SelectionDraft();this.epoch=0;this.readSequence=0;this.busy=false;this.error=null;}
 identity(user){if((this.user?.name??null)!==(user?.name??null)||(this.user?.role??null)!==(user?.role??null)){this.epoch++;this.state=null;this.users=[];this.unknown=null;this.draft=new SelectionDraft();this.error=null;this.busy=false;}this.user=user;}
 async json(path,options={}){let response;try{response=await this.fetch(path,options);const data=await response.json();if(!response.ok)throw Object.assign(new Error('HTTP response'),{status:response.status,error:data.error,known:response.status<500});return data;}catch(e){if(!e.known)e.unknown=true;throw e;}}
 async refresh({includeUsers=false,explicit=false}={}){
  const serial=++this.readSequence,startEpoch=this.epoch,unknownAtStart=this.unknown;this.error=null;
  try{const session=await this.json('/api/session');if(serial!==this.readSequence||startEpoch!==this.epoch)return false;this.identity(session.user);const epoch=this.epoch;
   if(!this.user){this.onChange();return true;}
   const state=await this.json('/api/state');if(serial!==this.readSequence||epoch!==this.epoch)return false;
   let users;if(includeUsers&&this.user.role==='admin')users=(await this.json('/api/users')).users;
   if(serial!==this.readSequence||epoch!==this.epoch)return false;
   if(this.state&&state.revision<this.state.revision)return false;this.state=state;if(users)this.users=users;this.draft.reconcile(state,this.user.name);
   if(explicit&&unknownAtStart===this.unknown&&(this.unknown==='state'||(this.unknown==='users'&&users)))this.unknown=null;this.error=null;this.onChange();return true;
  }catch(e){if(serial===this.readSequence){this.error=e.error??{code:'READ_FAILED'};this.onChange();}return false;}
 }
 async write(path,body){
  if(this.unknown||this.busy)return false;this.readSequence++;const epoch=this.epoch,draftGeneration=this.draft.generation;this.busy=true;this.error=null;this.onChange();
  try{const data=await this.json(path,{method:'POST',headers:{'Content-Type':'application/json',...(this.user?{'X-CSRF-Token':this.user.csrf}:{})},body:JSON.stringify(body)});if(epoch!==this.epoch)return false;
   if(path==='/api/login'){this.identity(data.user);return true;}if(path==='/api/logout'){this.identity(null);return true;}
   if(data.data&&Number.isSafeInteger(data.revision)&&(!this.state||data.revision>=this.state.revision)){this.state=data;this.draft.reconcile(data,this.user.name);}
   if(body.action==='shortlistCreate'&&draftGeneration===this.draft.generation)this.draft.start(this.draft.publicationId);
   return true;
  }catch(e){if(epoch!==this.epoch)return false;if(e.unknown)this.unknown=path==='/api/users'?'users':'state';this.error=e.error??{code:e.unknown?'UNKNOWN_OUTCOME':'WRITE_FAILED'};return false;}
  finally{if(epoch===this.epoch){this.readSequence++;this.busy=false;this.onChange();}}
 }
}
