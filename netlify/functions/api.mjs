import { getStore } from '@netlify/blobs';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const catalogStore=()=>getStore('monoize-catalog');
const assignmentStore=()=>getStore('monoize-assignments');
const submissionStore=()=>getStore('monoize-results');
const imageStore=()=>getStore('monoize-images');
const attemptsStore=()=>getStore('monoize-attempts');
const gradingDefaults={mode:'assessment',maxAttempts:2,penalty:10,feedback:'general',showScore:true,lockAfter:true};
const gradingFor=a=>{const r={...gradingDefaults,...(a.grading||{})};r.mode=r.mode==='practice'?'practice':'assessment';r.maxAttempts=[1,2,3,5].includes(Number(r.maxAttempts))?Number(r.maxAttempts):2;r.penalty=[0,5,10,15,20,25].includes(Number(r.penalty))?Number(r.penalty):10;r.feedback=['general','hints','detailed'].includes(r.feedback)?r.feedback:'general';r.showScore=!!r.showScore;r.lockAfter=!!r.lockAfter;return r};
const denverDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const attemptKey=(id,firstName,classPeriod)=>studentKey(id,firstName,classPeriod)+'_day_'+denverDay();
const studentKey=(id,firstName,classPeriod)=>'a_'+createHmac('sha256',process.env.MONOIZE_SESSION_SECRET||'monoize').update(id+'|'+classPeriod+'|'+firstName.trim().normalize('NFC').toLocaleLowerCase('en')).digest('hex');
const JSON_HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
const resp=(body,status=200,headers={})=>new Response(JSON.stringify(body),{status,headers:{...JSON_HEADERS,...headers}});
const error=(message,status=400)=>resp({error:message},status);
const baseCatalog=[
 {id:'voice',name:'Voice',category:'source',image:'/images/voice.svg',inputs:[],outputs:[{name:'Acoustic sound',types:['ACOUSTIC']}]},
 {id:'mic',name:'Handheld Microphone',category:'source',image:'/images/handheld-mic.svg',inputs:[{name:'Sound in',types:['ACOUSTIC']}],outputs:[{name:'XLR out',types:['XLR']}]},
 {id:'condenser',name:'Condenser Microphone',category:'source',image:'/images/condenser-mic.png',inputs:[{name:'Sound in',types:['ACOUSTIC']}],outputs:[{name:'XLR out',types:['XLR']}]},
 {id:'wirelessMic',name:'Wireless Microphone',category:'source',image:'/images/dji-wireless-mic.png',inputs:[{name:'Sound in',types:['ACOUSTIC']}],outputs:[{name:'Wireless transmitter',types:['WIRELESS']}]},
 {id:'wirelessRx',name:'Wireless Receiver (XLR out)',category:'gear',image:'/images/dji-wireless-receiver.png',inputs:[{name:'Wireless receiver',types:['WIRELESS']}],outputs:[{name:'XLR output',types:['XLR']}]},
 {id:'guitar',name:'Electric Guitar',category:'source',image:'/images/electric-guitar-card.png',inputs:[],outputs:[{name:'Instrument output',types:['TS']}]},
 {id:'dj',name:'DJ Source',category:'source',image:'/images/dj-source-card.png',inputs:[],outputs:[{name:'RCA out L (left)',types:['RCA']},{name:'RCA out R (right)',types:['RCA']}]},
 {id:'ipad',name:'iPad',category:'source',image:'/images/ipad-card.png',inputs:[],outputs:[{name:'USB-C audio out',types:['USB']}]},
 {id:'adapter',name:'USB-C Audio Adapter',category:'gear',image:'/images/usbc-adapter-card.png',inputs:[{name:'USB-C input',types:['USB']}],outputs:[{name:'3.5mm audio output',types:['HYBRID']}]},
 {id:'interface',name:'Audio Interface',category:'gear',image:'/images/audio-interface.png',inputs:[{name:'Combo input 1 (mic / line / instrument)',types:['XLR','TRS','TS']},{name:'Combo input 2 (mic / line / instrument)',types:['XLR','TRS','TS']}],outputs:[{name:'Line Out L (left)',types:['TRS','TS']},{name:'USB output',types:['USB']},{name:'Line Out R (right)',types:['TRS','TS']}]},
 {id:'mixer',name:'Audio Mixer',category:'gear',image:'/images/mixer.svg',inputs:[{name:'Mic 1',types:['XLR']},{name:'Mic 2',types:['XLR']},{name:'Line A (left)',types:['TRS','TS','RCA','HYBRID']},{name:'Line B (right)',types:['TRS','TS','RCA','HYBRID']}],outputs:[{name:'Main Out L (left)',types:['TRS','TS']},{name:'Main Out R (right)',types:['TRS','TS']}]},
 {id:'rodecaster',name:'RØDECaster Pro II (Mixer / Interface)',category:'gear',image:'/images/rodecaster-pro-ii.png',inputs:[{name:'Combo input 1 (mic / line / instrument)',types:['XLR','TRS','TS']},{name:'Combo input 2 (mic / line / instrument)',types:['XLR','TRS','TS']},{name:'Combo input 3 (mic / line / instrument)',types:['XLR','TRS','TS']},{name:'Combo input 4 (mic / line / instrument)',types:['XLR','TRS','TS']}],outputs:[{name:'USB-C 1 (computer)',types:['USB']},{name:'Main Out L (left)',types:['TRS','TS']},{name:'Main Out R (right)',types:['TRS','TS']},{name:'USB-C 2 (computer or phone)',types:['USB']}]},
 {id:'laptop',name:'Laptop',category:'destination',image:'/images/laptop-card.png',inputs:[{name:'USB input',types:['USB']}],outputs:[]},
 {id:'speaker',name:'PA Speakers',category:'destination',image:'/images/pa-system-card.png',inputs:[{name:'Left speaker input',types:['TRS','RCA']},{name:'Right speaker input',types:['TRS','RCA']}],outputs:[]},
 {id:'monitors',name:'Studio Monitors',category:'destination',image:'/images/studio-monitors-card.png',inputs:[{name:'Left speaker input',types:['TRS','RCA']},{name:'Right speaker input',types:['TRS','RCA']}],outputs:[]}
];
const baseCables=[
 {id:'ACOUSTIC',name:'Acoustic sound',image:'',color:'#cbd5e1'},
 {id:'WIRELESS',name:'Wireless link',image:'',color:'#5de0ab'},
 {id:'XLR',name:'XLR Cable',image:'/images/xlr-cable-card.png',color:'#62d8ef'},
 {id:'TRS',name:'1/4-inch TRS',image:'/images/trs-cable-card.png',color:'#ffce70'},
 {id:'TS',name:'1/4-inch TS',image:'/images/ts-cable-card.png',color:'#ffb76c'},
 {id:'USB',name:'USB Cable',image:'/images/usb-cable-card.png',color:'#c29afc'},
 {id:'HYBRID',name:'1/8-inch TRS to stereo 1/4-inch',image:'/images/hybrid-cable-card.png',color:'#ecdf75'},
 {id:'RCA',name:'RCA Cable',image:'/images/rca-cable-card.png',color:'#ff8c9c'}
];
const defaultAssignment={grading:gradingDefaults,id:'demo',title:'Voice → Mic → Interface → Mixer → PA',instructions:'Build a complete signal chain. Select each gold output and blue input, then choose the correct cable. Click Check when finished.',published:true,allowed:['voice','mic','interface','mixer','speaker'],cables:baseCables.map(x=>x.id),nodes:[{id:'n1',type:'voice',x:20,y:50},{id:'n2',type:'mic',x:205,y:50},{id:'n3',type:'interface',x:390,y:50},{id:'n4',type:'mixer',x:575,y:50},{id:'n5',type:'speaker',x:760,y:250}],key:[{from:'n1',fi:0,to:'n2',ti:0,cable:'ACOUSTIC'},{from:'n2',fi:0,to:'n3',ti:0,cable:'XLR'},{from:'n3',fi:0,to:'n4',ti:2,cable:'TRS'},{from:'n4',fi:0,to:'n5',ti:0,cable:'TRS'}]};
const normalizeCatalog=(saved)=>Array.isArray(saved)?saved:baseCatalog;
const normalizeCables=(saved)=>Array.isArray(saved)?saved:baseCables;
// Bring legacy built-in combo-input definitions up to date without resetting user image uploads or custom cards.
function upgradeLegacyBuiltins(gear){return gear.map(item=>{
 if(!['interface','mixer','rodecaster'].includes(item.id))return item;
 const next={...item,inputs:(item.inputs||[]).map(p=>({...p,types:[...(p.types||[])]})),outputs:(item.outputs||[]).map(p=>({...p,types:[...(p.types||[])]}))};
 // Only add TRS to recognized stock combo ports. Custom ports stay untouched.
 next.inputs.forEach(p=>{
  if(/^Combo input [1-4](?:$|\s|\()/i.test(p.name)&&p.types.includes('XLR')&&p.types.includes('TS')&&!p.types.includes('TRS'))p.types.push('TRS');
  if(/^Combo input [1-4]$/i.test(p.name))p.name+=' (mic / line / instrument)';
 });
 if(item.id==='interface')next.outputs.forEach(p=>{if(/^Stereo line output/i.test(p.name)&&p.types.includes('TRS')&&!p.types.includes('TS'))p.types.push('TS')});
 // Existing saved stock mixer ports need this migration too; leave custom outputs alone.
 if(item.id==='mixer'||item.id==='rodecaster')next.outputs.forEach(p=>{if(/^(Main line output|Main TRS output)$/i.test(p.name)&&p.types.includes('TRS')&&!p.types.includes('TS'))p.types.push('TS')});
 // Four RØDECaster Pro II combo inputs. Migrate the older placeholder third port.
 if(item.id==='rodecaster'&&next.inputs.length===3&&next.inputs[2].name==='Line input'&&next.inputs[2].types.join(',')==='TRS'){
   next.inputs[2]={name:'Combo input 3 (mic / line / instrument)',types:['XLR','TRS','TS']};
   next.inputs.push({name:'Combo input 4 (mic / line / instrument)',types:['XLR','TRS','TS']});
 }
 // V11.4: RØDECaster Pro II has two USB-C ports and two separate balanced 1/4" main outputs (L and R).
 // Old stock ports keep their positions (0 = USB, 1 = main) so saved answer keys still match; new ports are appended.
 if(item.id==='rodecaster'&&next.outputs.length===2&&next.outputs[0].name==='USB audio interface out'&&next.outputs[1].name==='Main TRS output'){
  next.outputs=[{name:'USB-C 1 (computer)',types:['USB']},{name:'Main Out L (left)',types:['TRS','TS']},{name:'Main Out R (right)',types:['TRS','TS']},{name:'USB-C 2 (computer or phone)',types:['USB']}];
 }
 return next;
})}
// V11.5: explicit left/right ports. Only stock port names are migrated, and the old port keeps its position
// (index) so saved teacher answer keys still match. New right-side ports are appended. Custom ports stay untouched.
function upgradeStereoPorts(gear){return gear.map(item=>{
 const cp=l=>(l||[]).map(p=>({...p,types:[...(p.types||[])]}));
 const next={...item,inputs:cp(item.inputs),outputs:cp(item.outputs)};
 const o=next.outputs,i=next.inputs;
 if(item.id==='dj'&&o.length===1&&o[0].name==='RCA stereo output'){next.outputs=[{name:'RCA out L (left)',types:[...o[0].types]},{name:'RCA out R (right)',types:[...o[0].types]}]}
 if(item.id==='interface'&&o.length===2&&/^Stereo line output/i.test(o[0].name)&&o[1].name==='USB output'){const t=[...o[0].types];next.outputs=[{name:'Line Out L (left)',types:t},o[1],{name:'Line Out R (right)',types:[...t]}]}
 if(item.id==='mixer'){
  if(o.length===1&&/^Main (line|TRS) output$/i.test(o[0].name)){const t=[...o[0].types];next.outputs=[{name:'Main Out L (left)',types:t},{name:'Main Out R (right)',types:[...t]}]}
  i.forEach(p=>{if(p.name==='Line A')p.name='Line A (left)';if(p.name==='Line B')p.name='Line B (right)'});
 }
 if(item.id==='rodecaster')o.forEach(p=>{if(p.name==='Main Out L (1/4")')p.name='Main Out L (left)';if(p.name==='Main Out R (1/4")')p.name='Main Out R (right)'});
 if((item.id==='speaker'||item.id==='monitors')&&i.length===1&&i[0].name==='Line input'){const t=[...i[0].types];next.inputs=[{name:'Left speaker input',types:t},{name:'Right speaker input',types:[...t]}]}
 return next;
})}
async function loadCatalog(){return {gear:upgradeStereoPorts(upgradeLegacyBuiltins(normalizeCatalog(await catalogStore().get('gear',{type:'json'})))),cables:normalizeCables(await catalogStore().get('cables',{type:'json'}))}}
async function getAssignment(id){return id==='demo'?(await assignmentStore().get('item_demo',{type:'json'})||defaultAssignment):await assignmentStore().get('item_'+id,{type:'json'});}
const jsonSize=async req=>{const s=await req.text();if(s.length>250000)throw new Error('Request too large');return JSON.parse(s)};
function sessionSecret(){return process.env.MONOIZE_SESSION_SECRET||''}
function authToken(){let t=Math.floor(Date.now()/1000)+8*3600;let value=String(t);return value+'.'+createHmac('sha256',sessionSecret()).update(value).digest('hex')}
function teacherAuth(req){const token=(req.headers.get('cookie')||'').match(/(?:^|;\s*)monoize_teacher=([^;]+)/)?.[1]||'';const [expiry,sig]=token.split('.');if(!expiry||!sig||!sessionSecret()||!/^[0-9]+$/.test(expiry)||+expiry<Math.floor(Date.now()/1000))return false;const expected=createHmac('sha256',sessionSecret()).update(expiry).digest('hex');return sig.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected))}
const canon=(l)=>`${l.from}|${l.fi}|${l.to}|${l.ti}|${l.cable}`;
function diagnoseEdges(a,edges,catalog){
 const nodes=new Map((a.nodes||[]).map(n=>[n.id,n]));
 const gear=new Map(catalog.gear.map(x=>[x.id,x]));
 const cables=new Set(catalog.cables.map(x=>x.id));
 if(!Array.isArray(edges))return 'No valid connection list was received.';
 if(edges.length>100)return 'Too many connections (maximum 100).';
 const usedOutputs=new Set(),usedInputs=new Set();
 for(let index=0;index<edges.length;index++){
  const e=edges[index],number=index+1;
  if(!e||typeof e!=='object')return `Connection ${number} is missing data.`;
  const f=nodes.get(e.from),t=nodes.get(e.to);
  if(!f||!t)return `Connection ${number} uses a device that is not part of this saved assignment. Reload the assignment.`;
  if(f.id===t.id)return `Connection ${number} connects a device to itself.`;
  const fs=gear.get(f.type),ts=gear.get(t.type);
  if(!fs||!ts)return `Connection ${number} uses equipment missing from the current library. Ask your teacher to update the assignment.`;
  const out=fs.outputs?.[e.fi],inn=ts.inputs?.[e.ti];
  if(!out)return `Connection ${number}: ${fs.name} output ${Number(e.fi)+1} is missing from the current library. Your teacher should check its saved ports.`;
  if(!inn)return `Connection ${number}: ${ts.name} input ${Number(e.ti)+1} is missing from the current library. Your teacher should check its saved ports.`;
  if(!cables.has(e.cable))return `Connection ${number} refers to a cable no longer in the equipment library.`;
  // In student assessment mode, wrong connector choices are scored, not rejected.
  // Port compatibility is checked against the saved teacher answer key during grading.
  const ip=`${e.to}:${e.ti}`,op=`${e.from}:${e.fi}`;
  if(usedInputs.has(ip))return `Connection ${number}: ${ts.name} input ${inn.name} is already connected.`;
  if(usedOutputs.has(op))return `Connection ${number}: ${fs.name} output ${out.name} is already connected.`;
  usedInputs.add(ip);usedOutputs.add(op);
 }
 return null;
}
// Match student canvas nodes to assignment device slots by equipment type.
// This is necessary when a student removes a card and adds it back: the UI assigns a new node ID.
// Prefer exact saved IDs, then pair remaining instances of the same equipment type.
// Match any student-selected equipment against the teacher's slots. Wrong/missing devices
// are valid submissions and lower the grade instead of blocking submission.
function matchStudentCanvas(a,submittedNodes,edges){
 if(!Array.isArray(submittedNodes)||submittedNodes.length>45)return {error:'Invalid student equipment list.'};
 if(!Array.isArray(a.nodes)||!a.nodes.length)return {error:'This assignment has no saved teacher layout. Ask the teacher to save an exemplar.'};
 if(!Array.isArray(edges)||edges.length>100)return {error:'Invalid connection list.'};
 const ids=new Set();
 for(const n of submittedNodes){
  if(!n||typeof n.id!=='string'||typeof n.type!=='string'||ids.has(n.id)||!/^[a-zA-Z0-9_-]{1,60}$/.test(n.id))return {error:'Duplicate or invalid equipment IDs.'};
  ids.add(n.id);
  if(!a.allowed.includes(n.type))return {error:'Equipment outside the assigned equipment bank.'};
 }
 const assigned=new Set(),mapping=new Map();
 for(const n of submittedNodes){
  const slot=a.nodes.find(t=>t.type===n.type&&!assigned.has(t.id));
  if(slot){mapping.set(n.id,slot.id);assigned.add(slot.id)}
 }
 const mapped=[];
 for(const e of edges){
  if(!e||!ids.has(e.from)||!ids.has(e.to))return {error:'A wire points to a missing device.'};
  mapped.push({...e,from:mapping.get(e.from)||'unmatched_'+e.from,to:mapping.get(e.to)||'unmatched_'+e.to});
 }
 return {edges:mapped,matchedDevices:assigned.size,studentCount:submittedNodes.length};
}

function validateStudentWires(nodes,edges,catalog){
 const byNode=new Map(nodes.map(n=>[n.id,n]));
 const gear=new Map(catalog.gear.map(g=>[g.id,g]));
 const cables=new Set(catalog.cables.map(c=>c.id));
 const inputs=new Set(),outputs=new Set();
 for(const e of edges){
  const from=byNode.get(e.from),to=byNode.get(e.to);
  if(!from||!to||e.from===e.to)return 'A connection has a missing or identical device.';
  const out=gear.get(from.type)?.outputs?.[e.fi],inn=gear.get(to.type)?.inputs?.[e.ti];
  if(!out||!inn)return 'A connection references a port that does not exist. Reload and check your equipment.';
  if(!cables.has(e.cable))return 'A selected cable is no longer in the cable bank.';
  const ik=e.to+':'+e.ti,ok=e.from+':'+e.fi;
  if(inputs.has(ik)||outputs.has(ok))return 'One input or output has multiple wires; disconnect one before submitting.';
  inputs.add(ik);outputs.add(ok);
 }
 return null;
}

function checkEdges(a,edges,catalog){return diagnoseEdges(a,edges,catalog)===null;}

const sanitizeAssignment=a=>({id:a.id,title:a.title,instructions:a.instructions,published:!!a.published,allowed:a.allowed,cables:a.cables,grading:gradingFor(a)}); // V11.4: never send the teacher exemplar layout (a.nodes) to students
const CLASS_PERIODS=['6A','7A','8A','8B'];
const validStudent=(firstName,classPeriod)=>typeof firstName==='string'&&firstName.trim().length>=1&&firstName.trim().length<=32&&/^[\p{L}][\p{L}\p{M}'’ -]*$/u.test(firstName.trim())&&CLASS_PERIODS.includes(classPeriod);
const allowedOrigin=(req)=>new URL(req.url).origin;
export default async function handler(req){
 try{
  const path=new URL(req.url).pathname.replace(/^\/(?:\.netlify\/functions\/api|api)\/?/,'').split('/')[0]||'';
  if(path==='status')return resp({ok:true,configured:!!(process.env.MONOIZE_TEACHER_PASSWORD&&sessionSecret())});
  if(path==='login'){
   if(req.method!=='POST')return error('Method not allowed',405);
   if(!process.env.MONOIZE_TEACHER_PASSWORD||!sessionSecret())return error('Teacher credentials not configured on Netlify',503);
   const {password}=await jsonSize(req);const p=Buffer.from(String(password||'')),expected=Buffer.from(process.env.MONOIZE_TEACHER_PASSWORD);if(p.length!==expected.length||!timingSafeEqual(p,expected))return error('Incorrect password',401);
   return resp({ok:true},200,{'set-cookie':`monoize_teacher=${authToken()}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800`});
  }
  if(path==='logout')return resp({ok:true},200,{'set-cookie':'monoize_teacher=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0'});
  if(path==='me')return resp({teacher:teacherAuth(req)});
  if(path==='image'){
   const id=new URL(req.url).searchParams.get('id');if(!id||!/^[a-z0-9-]{12,80}$/.test(id))return error('Invalid image',400);
   const found=await imageStore().getWithMetadata('img_'+id,{type:'arrayBuffer'});if(!found)return error('Image not found',404);
   return new Response(found.data,{headers:{'content-type':found.metadata?.mime||'image/png','cache-control':'public, max-age=86400','x-content-type-options':'nosniff'}});
  }
  if(path==='play'){
   const id=new URL(req.url).searchParams.get('id')||'demo';if(!/^[a-zA-Z0-9_-]{1,60}$/.test(id))return error('Invalid ID');
   const a=await getAssignment(id);if(!a||!a.published)return error('Assignment unavailable',404);
   const c=await loadCatalog();return resp({assignment:sanitizeAssignment(a),gear:c.gear.filter(g=>a.allowed.includes(g.id)),cables:c.cables.filter(g=>a.cables.includes(g.id))});
  }
  if(path==='attempt-status'){
   const u=new URL(req.url),id=u.searchParams.get('id')||'',firstName=u.searchParams.get('firstName')||'',classPeriod=u.searchParams.get('classPeriod')||'';
   if(!/^[a-zA-Z0-9_-]{1,60}$/.test(id)||!validStudent(firstName,classPeriod))return error('Enter a valid first name and class period');
   const a=await getAssignment(id);if(!a||!a.published)return error('Assignment unavailable',404);
   const g=gradingFor(a);const prior=await attemptsStore().get(attemptKey(id,firstName,classPeriod),{type:'json'})||{count:0,locked:false};
   const count=Math.max(0,Number(prior.count)||0);const remaining=g.mode==='practice'?null:Math.max(0,g.maxAttempts-count);
   return resp({count,locked:g.mode==='assessment'&&(remaining===0),remaining,grading:g,day:denverDay(),resetTimezone:'America/Denver'});
  }
  if(path==='submit'){
   if(req.method!=='POST')return error('Method not allowed',405);
   const {id,edges,nodes,firstName,classPeriod}=await jsonSize(req);const a=await getAssignment(String(id||''));if(!a||!a.published)return error('Assignment unavailable',404);
   if(!validStudent(firstName,classPeriod))return error('Enter your first name and select a class period');
   const catalog=await loadCatalog();if(!Array.isArray(edges))return error('No valid connection list received. No attempt was used.',400);const issue=validateStudentWires(nodes||[],edges,catalog);if(issue)return error(issue+' No attempt was used.',400);const mapped=matchStudentCanvas(a,nodes,edges);if(mapped.error)return error(mapped.error+' No attempt was used.',400);const gradedEdges=mapped.edges;
   const g=gradingFor(a),key=attemptKey(a.id,firstName,classPeriod),prev=await attemptsStore().get(key,{type:'json'})||{count:0,locked:false};
   if(g.mode==='assessment'&&(prev.count>=g.maxAttempts))return error('No graded attempts remaining. Ask your teacher for help.',403);
   const expected=new Set(a.key.map(canon)),actual=new Set(gradedEdges.map(canon));const correct=[...actual].filter(k=>expected.has(k)).length;
   // 30% equipment identification + 70% connection accuracy. Extra incorrect
   // equipment or wires reduce precision; empty/incomplete submissions get partial credit.
   const equipmentAccuracy= a.nodes.length ? mapped.matchedDevices/Math.max(a.nodes.length,mapped.studentCount) : 0;
   const cableAccuracy= expected.size ? correct/Math.max(expected.size,actual.size) : 0;
   const rawScore=Math.round(100*(.30*equipmentAccuracy+.70*cableAccuracy));
   const calculatedScore=g.mode==='practice'?rawScore:Math.max(0,rawScore-prev.count*g.penalty);
   const score=Math.max(50,calculatedScore); // DPS-equity configured floor on recorded grades; raw score retained
   const count=prev.count+1,complete=correct===expected.size&&actual.size===expected.size&&mapped.matchedDevices===a.nodes.length&&mapped.studentCount===a.nodes.length;
   const locked=g.mode==='assessment'&&g.lockAfter&&count>=g.maxAttempts;
   const record={id:randomUUID(),assignment:a.id,title:a.title,firstName:firstName.trim(),classPeriod,score,calculatedScore,gradeFloor:50,gradeFloorApplied:calculatedScore<50,rawScore,penaltyApplied:g.mode==='practice'?0:prev.count*g.penalty,attempt:count,gradingDay:denverDay(),mode:g.mode,complete,correct,total:expected.size,equipmentCorrect:mapped.matchedDevices,equipmentTotal:a.nodes.length,submittedAt:new Date().toISOString()};
   await attemptsStore().setJSON(key,{count,locked,lastScore:score,updatedAt:record.submittedAt});
   await submissionStore().setJSON('r_'+record.id,record);
   const remaining=g.mode==='practice'?null:Math.max(0,g.maxAttempts-count);
   const general=complete?'All required equipment and connections are correct.':'Some devices or connections need work. Review your signal flow.';
   let hint=general;
   if(g.feedback==='hints'&&!complete)hint+=` You have ${Math.max(0,expected.size-correct)} missing or incorrect required connection(s).`;
   if(g.feedback==='detailed'&&!complete)hint+=` ${[...actual].filter(x=>!expected.has(x)).length} submitted wire(s) do not match the answer key.`;
   return resp({score:g.showScore?score:null,rawScore:g.showScore?rawScore:null,calculatedScore:g.showScore?calculatedScore:null,gradeFloorApplied:g.showScore?record.gradeFloorApplied:null,penaltyApplied:g.showScore?record.penaltyApplied:null,correct:g.feedback==='detailed'?correct:null,total:g.feedback==='detailed'?expected.size:null,attempt:count,remaining,locked,complete,gradingDay:denverDay(),feedback:hint,submittedAt:record.submittedAt,receipt:record.id.slice(0,8)});
  }
  if(!teacherAuth(req))return error('Teacher login required',401);
  if(path==='reset-attempts'){
   if(req.method!=='POST')return error('Method not allowed',405);
   const {id,firstName,classPeriod}=await jsonSize(req);
   if(!/^[a-zA-Z0-9_-]{1,60}$/.test(String(id||''))||!validStudent(firstName,classPeriod))return error('Valid assignment, first name and class are required');
   const a=await getAssignment(id);if(!a)return error('Assignment not found',404);
   const key=attemptKey(id,firstName,classPeriod),prior=await attemptsStore().get(key,{type:'json'});
   if(!prior||!prior.count)return resp({ok:true,day:denverDay(),message:'No attempts recorded today; this student already has a fresh attempt window.'});
   await attemptsStore().setJSON(key,{count:0,locked:false,updatedAt:new Date().toISOString(),resetByTeacher:true});
   return resp({ok:true,day:denverDay(),message:'Attempts reset. This student can start again at attempt 1 today. Previous grades remain in Results.'});
  }
  if(path==='delete-all-grades'){
   if(req.method!=='POST')return error('Method not allowed',405);
   const {confirmation}=await jsonSize(req);
   if(confirmation!=='DELETE ALL GRADES')return error('Explicit confirmation required',400);
   // Teacher-only: remove every recorded grade and every historical attempt counter.
   // Leave assignments, answer keys, gear, and uploaded images untouched.
   let deletedGrades=0,deletedAttempts=0;
   for(const [store,prefix,kind] of [[submissionStore(),'r_','grades'],[attemptsStore(),'a_','attempts']]){
    let cursor;
    do{
     const page=await store.list({prefix,cursor});
     for(const entry of page.blobs){await store.delete(entry.key);if(kind==='grades')deletedGrades++;else deletedAttempts++;}
     cursor=page.cursor;
    }while(cursor);
   }
   return resp({ok:true,deletedGrades,deletedAttempts,message:`Deleted ${deletedGrades} grades and reset all student attempts. Assignments and equipment were preserved.`});
  }
  if(path==='clear-grades'){
   if(req.method!=='POST')return error('Method not allowed',405);
   const {id,firstName,classPeriod,confirmation}=await jsonSize(req);
   if(!/^[a-zA-Z0-9_-]{1,60}$/.test(String(id||''))||!validStudent(firstName,classPeriod))return error('Valid assignment, first name and class are required');
   if(confirmation!=='DELETE GRADES')return error('Confirmation required');
   if(!await getAssignment(id))return error('Assignment not found',404);
   // Read all result pages, not only the 300 displayed on the dashboard.
   const keys=[];let cursor;
   do{
    const page=await submissionStore().list({prefix:'r_',cursor});
    keys.push(...page.blobs.map(x=>x.key));cursor=page.cursor;
   }while(cursor);
   const normalized=firstName.trim().normalize('NFC').toLocaleLowerCase('en');
   let deleted=0;
   for(let i=0;i<keys.length;i+=40){
    const chunk=keys.slice(i,i+40);
    const records=await Promise.all(chunk.map(k=>submissionStore().get(k,{type:'json'})));
    for(let j=0;j<chunk.length;j++){
     const record=records[j];
     if(record?.assignment===id&&record.classPeriod===classPeriod&&String(record.firstName||'').trim().normalize('NFC').toLocaleLowerCase('en')===normalized){
      await submissionStore().delete(chunk[j]);deleted++;
     }
    }
   }
   // Reset today's attempts too, so cleared scores can be replaced immediately.
   await attemptsStore().setJSON(attemptKey(id,firstName,classPeriod),{count:0,locked:false,updatedAt:new Date().toISOString(),resetByTeacher:true,gradesCleared:true});
   return resp({ok:true,deleted,message:`Deleted ${deleted} recorded grade(s) for this student and assignment, and reset today's attempts to 0.`});
  }
  if(path==='catalog')return resp(await loadCatalog());
  if(path==='save-catalog'){
   if(req.method!=='POST')return error('Method not allowed',405);
   const d=await jsonSize(req);const cat=await loadCatalog();const type=d.kind==='gear'?'gear':d.kind==='cables'?'cables':null;if(!type)return error('Invalid kind');
   const item=d.item;if(!item||!/^[a-zA-Z0-9_-]{1,48}$/.test(item.id)||typeof item.name!=='string'||item.name.length>80)return error('Invalid item');
   if(typeof item.image!=='string'||item.image.length>500||!(item.image.startsWith('/images/')||item.image.startsWith('/api/image?id=')||item.image===''))return error('Invalid image path');
   if(type==='gear'){
     item.category=['source','gear','destination'].includes(item.category)?item.category:'gear';
     for(const arr of [item.inputs,item.outputs]){if(!Array.isArray(arr)||arr.length>8)return error('Invalid ports');for(const port of arr){if(!port||typeof port.name!=='string'||port.name.length>70||!Array.isArray(port.types)||!port.types.length||port.types.some(t=>!cat.cables.some(c=>c.id===t)))return error('Invalid port connection types')}}
   }else {if(!/^#[a-fA-F0-9]{6}$/.test(item.color))return error('Invalid cable color')}
   const list=cat[type];const i=list.findIndex(x=>x.id===item.id);if(i>=0)list[i]=item;else list.push(item);await catalogStore().setJSON(type,list);return resp({ok:true,item});
  }
  if(path==='upload-image'){
   if(req.method!=='POST')return error('Method not allowed',405);
   const form=await req.formData(),file=form.get('file');if(!file||typeof file.arrayBuffer!=='function')return error('Choose a file');if(file.size>2_000_000||file.size<100)return error('Image must be between 100 bytes and 2 MB');
   const mime=file.type;if(!['image/png','image/jpeg','image/webp','image/gif'].includes(mime))return error('Use PNG, JPG, WEBP, or GIF');
   const buffer=await file.arrayBuffer();const bytes=new Uint8Array(buffer);const isPng=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;const isJpg=bytes[0]===255&&bytes[1]===216;const isWebp=String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';const isGif=String.fromCharCode(...bytes.slice(0,3))==='GIF';
   if(!(mime==='image/png'&&isPng||mime==='image/jpeg'&&isJpg||mime==='image/webp'&&isWebp||mime==='image/gif'&&isGif))return error('File does not match its image type');
   const id=randomUUID();await imageStore().set('img_'+id,buffer,{metadata:{mime}});return resp({url:'/api/image?id='+id});
  }
  if(path==='assignments'){
   const index=await assignmentStore().get('index',{type:'json'})||[];return resp({assignments:[{id:'demo',title:defaultAssignment.title,published:true},...index.filter(x=>x.id!=='demo')]});
  }
  if(path==='assignment'){
   const id=new URL(req.url).searchParams.get('id')||'demo';const a=await getAssignment(id);return a?resp({assignment:a}):error('Not found',404);
  }
  if(path==='save-assignment'){
   if(req.method!=='POST')return error('Method not allowed',405);const a=await jsonSize(req);
   if(!/^[a-zA-Z0-9_-]{1,60}$/.test(a.id||'')||typeof a.title!=='string'||a.title.length<2||a.title.length>100||typeof a.instructions!=='string'||a.instructions.length>1200)return error('Invalid assignment name');
   const c=await loadCatalog(),gear=new Set(c.gear.map(x=>x.id)),cables=new Set(c.cables.map(x=>x.id));
   if(!Array.isArray(a.allowed)||a.allowed.length>50||a.allowed.some(x=>!gear.has(x))||!Array.isArray(a.cables)||a.cables.some(x=>!cables.has(x)))return error('Invalid equipment or cable list');
   if(!Array.isArray(a.nodes)||a.nodes.length>45||a.nodes.some(x=>!a.allowed.includes(x.type)||!/^[a-zA-Z0-9_-]{1,60}$/.test(x.id)||!Number.isFinite(x.x)||!Number.isFinite(x.y)))return error('Invalid nodes');
   const keyIssue=diagnoseEdges(a,a.key,c);if(keyIssue)return error('Answer key issue: '+keyIssue);
   a.grading=gradingFor(a);a.published=!!a.published;a.updatedAt=new Date().toISOString();await assignmentStore().setJSON('item_'+a.id,a);
   const index=await assignmentStore().get('index',{type:'json'})||[];const i=index.findIndex(x=>x.id===a.id);const entry={id:a.id,title:a.title,published:a.published,updatedAt:a.updatedAt};if(i>=0)index[i]=entry;else index.push(entry);await assignmentStore().setJSON('index',index);
   return resp({ok:true,id:a.id});
  }
  if(path==='results'){
   const pages=[];let cursor;do{const batch=await submissionStore().list({prefix:'r_',cursor});pages.push(...batch.blobs);cursor=batch.cursor}while(cursor&&pages.length<1000);
   const newest=pages.slice(0,300);const rows=(await Promise.all(newest.map(x=>submissionStore().get(x.key,{type:'json'})))).filter(Boolean);
   rows.sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt));return resp({results:rows});
  }
  return error('Unknown operation',404);
 }catch(e){console.error('Monoize V9 API:',e);return error('Server error: '+(e.message==='Request too large'?'Request too large':'Check deployment configuration or input'),500)}
}
