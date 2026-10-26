import {$,api,notice,Board,esc} from './core.js';
const gradingDefaults={mode:'assessment',maxAttempts:2,penalty:10,feedback:'general',showScore:true,lockAfter:true};
const getGrading=()=>({mode:$('gradingMode').value,maxAttempts:Number($('maxAttempts').value),penalty:Number($('penalty').value),feedback:$('gradingFeedback').value,showScore:$('showScore').checked,lockAfter:$('lockAfter').checked});
const setGrading=g=>{g={...gradingDefaults,...g};$('gradingMode').value=g.mode;$('maxAttempts').value=String(g.maxAttempts);$('penalty').value=String(g.penalty);$('gradingFeedback').value=g.feedback;$('showScore').checked=g.showScore;$('lockAfter').checked=g.lockAfter};
const board=new Board({teacher:true});
$('zoomOut').onclick=()=>board.setZoom(board.zoom-.25);$('zoomIn').onclick=()=>board.setZoom(board.zoom+.25);$('zoomReset').onclick=()=>board.setZoom(1);
let catalog={gear:[],cables:[]},currentItem=null,results=[];
let assignment={id:'',title:'',instructions:'',published:false,allowed:[],cables:[],nodes:[],key:[]};
const show=(id,enabled)=>$(id).classList.toggle('hidden',!enabled);const say=(id,msg,ok=true)=>$(id).innerHTML=`<span class="${ok?'good':'bad'}">${esc(msg)}</span>`;
async function init(){try{const me=await api('me');show('loginPane',!me.teacher);show('studio',me.teacher);if(me.teacher){await getCatalog();await refreshAssignments();await loadAssignment('demo')}}catch(e){say('loginFeedback',e.message,false)}}
$('login').onclick=async()=>{try{await api('login',{password:$('password').value});$('password').value='';await init()}catch(e){say('loginFeedback',e.message,false)}};
$('password').addEventListener('keydown',e=>{if(e.key==='Enter')$('login').click()});
$('logout').onclick=async()=>{await api('logout');location.reload()};
document.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{for(const t of ['assign','assets','results'])show(t,t===btn.dataset.tab);document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===btn));if(btn.dataset.tab==='results')refreshResults()});
async function getCatalog(selectedKind=currentKind(),selectedId=currentItem?.id){catalog=await api('catalog?refresh='+Date.now());board.setCatalog(catalog.gear,catalog.cables);renderChecks();renderAssetList(selectedKind,selectedId)}
function renderChecks(){for(const [id,list,key] of [['allowedGear',catalog.gear,'allowed'],['allowedCables',catalog.cables,'cables']]){$(id).innerHTML=list.map(item=>`<label><input type="checkbox" value="${esc(item.id)}" ${assignment[key]?.includes(item.id)?'checked':''}> ${esc(item.name)}</label>`).join('')}}
function getChecks(id){return [...$(id).querySelectorAll('input:checked')].map(i=>i.value)}
function fillAssignment(a){assignment=structuredClone(a);$('assignmentId').value=a.id;$('assignmentTitle').value=a.title;$('assignmentInstructions').value=a.instructions;$('published').checked=!!a.published;setGrading(a.grading);renderChecks();board.allowed=a.allowed;board.setNodes(a.nodes,a.key);say('feedback','Edit the answer key visually; use Save Assignment + Key when finished.')}
async function refreshAssignments(){const {assignments}=await api('assignments');$('assignmentList').innerHTML=assignments.map(a=>`<option value="${esc(a.id)}">${esc(a.title)}${a.published?' ✓':''}</option>`).join('')}
async function loadAssignment(id){try{const {assignment:a}=await api('assignment?id='+encodeURIComponent(id));fillAssignment(a)}catch(e){notice(e.message)}}
$('loadAssignment').onclick=()=>loadAssignment($('assignmentList').value);
$('newAssignment').onclick=()=>{fillAssignment({id:'',title:'',instructions:'',published:false,allowed:catalog.gear.map(g=>g.id),cables:catalog.cables.map(c=>c.id),nodes:[],key:[],grading:gradingDefaults});notice('New assignment. Add equipment to the canvas and build its correct connections.',true)};
$('clearCanvas').onclick=()=>{board.setNodes([]);notice('Canvas cleared.',true)};
$('saveAssignment').onclick=async()=>{const data={id:$('assignmentId').value.trim(),title:$('assignmentTitle').value.trim(),instructions:$('assignmentInstructions').value.trim(),published:$('published').checked,allowed:getChecks('allowedGear'),cables:getChecks('allowedCables'),nodes:board.nodes,key:board.links,grading:getGrading()};try{await api('save-assignment',data);assignment=data;await refreshAssignments();$('assignmentList').value=data.id;notice('Saved securely. Student link is ready if Published is enabled.',true)}catch(e){notice(e.message)}};
$('copyLink').onclick=async()=>{const id=$('assignmentId').value.trim();if(!id){notice('Save an assignment ID first.');return}const url=location.origin+'/?assignment='+encodeURIComponent(id);try{await navigator.clipboard.writeText(url);notice('Copied student link: '+url,true)}catch(e){notice('Student link: '+url,true)}};
// V11.6: port pictures are kept beside the text editor. A picture follows its port by name;
// if a port is renamed (its old name is gone), the picture stays with that line position.
let editorPorts={inputs:[],outputs:[]};
function parsePorts(raw,old=[]){const rows=raw.split('\n').map(s=>s.trim()).filter(Boolean).map(line=>{const [name,types]=line.split('|');if(!name||!types)throw Error('Each port must use Name|XLR,TRS format');return {name:name.trim(),types:types.split(',').map(x=>x.trim()).filter(Boolean)}});const names=new Set(rows.map(r=>r.name));return rows.map((r,i)=>{const image=old.find(p=>p.name===r.name)?.image??(old[i]&&!names.has(old[i].name)?old[i].image:undefined);return image!==undefined?{...r,image}:r})}
function syncEditorPorts(){editorPorts={inputs:parsePorts($('itemInputs').value,editorPorts.inputs),outputs:parsePorts($('itemOutputs').value,editorPorts.outputs)};return editorPorts}
function renderPortPhotos(){const box=$('portPhotos');if(!box)return;try{syncEditorPorts()}catch(e){box.innerHTML=`<p class="hint bad">${esc(e.message)} Fix the port list to edit port pictures.</p>`;return}
 const rows=[...editorPorts.inputs.map((p,i)=>({side:'inputs',i,p,label:'INPUT'})),...editorPorts.outputs.map((p,i)=>({side:'outputs',i,p,label:'OUTPUT'}))];
 box.innerHTML=rows.length?rows.map(r=>`<div class="portPhotoRow"><div class="portPhotoThumb">${r.p.image?`<img src="${esc(r.p.image)}" alt="">`:'<span>No picture</span>'}</div><div class="portPhotoInfo"><b class="${r.side==='inputs'?'inLabel':'outLabel'}">${r.label} ${r.i+1}</b><span>${esc(r.p.name)}</span></div><div class="portPhotoActions"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-side="${r.side}" data-i="${r.i}" aria-label="Picture for ${esc(r.p.name)}"><button type="button" class="uploadPortPhoto" data-side="${r.side}" data-i="${r.i}">Upload port picture</button>${r.p.image?`<button type="button" class="removePortPhoto" data-side="${r.side}" data-i="${r.i}">Remove</button>`:''}</div></div>`).join(''):'<p class="hint">This card has no ports yet.</p>';
 box.querySelectorAll('.uploadPortPhoto').forEach(b=>b.onclick=()=>uploadPortPhoto(b.dataset.side,+b.dataset.i,box.querySelector(`input[type=file][data-side="${b.dataset.side}"][data-i="${b.dataset.i}"]`).files[0]));
 box.querySelectorAll('.removePortPhoto').forEach(b=>b.onclick=()=>removePortPhoto(b.dataset.side,+b.dataset.i))}
async function uploadImageFile(file){const form=new FormData();form.append('file',file);const res=await fetch('/api/upload-image',{method:'POST',body:form});const d=await res.json().catch(()=>({}));if(!res.ok)throw Error(d.error||'Upload failed');return d.url}
function currentKind(){return $('itemType').value}
function renderAssetList(kind=currentKind(),selectedId=currentItem?.id){$('itemType').value=kind;const items=catalog[kind];$('itemSelect').innerHTML=items.map(i=>`<option value="${esc(i.id)}">${esc(i.name)}</option>`).join('');show('gearFields',kind==='gear');show('cableFields',kind==='cables');$('assetCards').innerHTML=items.map(i=>`<div class="smallcard" data-id="${esc(i.id)}"><img src="${esc(i.image)}" alt=""><b>${esc(i.name)}</b><small>${esc(i.id)}</small></div>`).join('');$('assetCards').querySelectorAll('.smallcard').forEach(c=>c.onclick=()=>fillItem(items.find(i=>i.id===c.dataset.id)));fillItem(items.find(i=>i.id===selectedId)||items[0]||null)}
function fillItem(item){currentItem=item;$('itemId').value=item?.id||'';$('itemId').readOnly=!!item;$('itemName').value=item?.name||'';$('itemImage').value=item?.image||'';$('imagePreview').src=item?.image||'';$('itemCategory').value=item?.category||'gear';$('itemInputs').value=(item?.inputs||[]).map(p=>p.name+'|'+p.types.join(',')).join('\n');$('itemOutputs').value=(item?.outputs||[]).map(p=>p.name+'|'+p.types.join(',')).join('\n');editorPorts={inputs:structuredClone(item?.inputs||[]),outputs:structuredClone(item?.outputs||[])};renderPortPhotos();$('itemColor').value=item?.color||'#62d8ef';if(item)$('itemSelect').value=item.id}
$('reloadImages').onclick=async()=>{try{await getCatalog(currentKind(),$('itemId').value);say('assetFeedback','Images reloaded from the server.',true)}catch(e){say('assetFeedback',e.message,false)}};
$('itemType').onchange=()=>{currentItem=null;renderAssetList(currentKind(),null)};$('itemSelect').onchange=()=>fillItem(catalog[currentKind()].find(i=>i.id===$('itemSelect').value));$('newItem').onclick=()=>{fillItem(null);say('assetFeedback','Enter an ID, name, and ports. Upload an image if needed.')};
// Save a card once, preserving its identity even when the library reloads.
function itemFromEditor(){
 const kind=currentKind();
 const item={id:$('itemId').value.trim(),name:$('itemName').value.trim(),image:$('itemImage').value.trim()};
 if(kind==='gear'){
   item.category=$('itemCategory').value;
   const ports=syncEditorPorts();
   item.inputs=ports.inputs;
   item.outputs=ports.outputs;
 }else item.color=$('itemColor').value;
 return {kind,item};
}
let busyImageSave=false;
function imageButtonsDisabled(value){$('uploadImage').disabled=value;$('saveItem').disabled=value;document.querySelectorAll('#portPhotos button').forEach(b=>b.disabled=value);}
async function saveEditedCard(message='Card and ports updated.'){
 const {kind,item}=itemFromEditor();
 const saved=await api('save-catalog',{kind,item});
 if(saved.item?.image!==item.image)throw Error('Server did not confirm the new image. Try again.');
 // Update the visible catalog immediately. Never replace the just-saved image
 // with a stale catalog snapshot returned immediately after a write.
 const list=catalog[kind];const i=list.findIndex(x=>x.id===item.id);
 if(i>=0)list[i]=structuredClone(saved.item);else list.push(structuredClone(saved.item));
 renderAssetList(kind,item.id);
 board.setCatalog(catalog.gear,catalog.cables);
 renderChecks();
 $('imagePreview').src=item.image;
 say('assetFeedback',message+' Reload the Student Lab to see the new image.',true);
 return item;
}
$('uploadImage').onclick=async()=>{
 if(busyImageSave)return;
 const file=$('itemFile').files[0];
 if(!file){say('assetFeedback','Choose an image file first.',false);return}
 busyImageSave=true;imageButtonsDisabled(true);
 say('assetFeedback','Uploading image and saving card…',true);
 try{
   // Validate metadata before uploading, so an invalid card cannot strand an upload.
   itemFromEditor();
   const url=await uploadImageFile(file);
   $('itemImage').value=url;
   $('imagePreview').src=url;
   await saveEditedCard('Image uploaded and saved to this card. No second save needed.');
   $('itemFile').value='';
 }catch(e){say('assetFeedback',e.message,false)}
 finally{busyImageSave=false;imageButtonsDisabled(false)}
};
async function uploadPortPhoto(side,i,file){
 if(busyImageSave)return;
 if(currentKind()!=='gear'){say('assetFeedback','Port pictures are for equipment and source cards.',false);return}
 if(!file){say('assetFeedback','Choose a port picture file first.',false);return}
 busyImageSave=true;imageButtonsDisabled(true);
 say('assetFeedback','Uploading port picture and saving card…',true);
 try{
   itemFromEditor(); // validate the card before uploading
   const port=editorPorts[side][i];if(!port)throw Error('That port no longer exists. Check the port list.');
   port.image=await uploadImageFile(file);
   await saveEditedCard(`Port picture saved for ${port.name}.`);
 }catch(e){say('assetFeedback',e.message,false)}
 finally{busyImageSave=false;imageButtonsDisabled(false)}
}
async function removePortPhoto(side,i){
 if(busyImageSave)return;
 const port=editorPorts[side][i];if(!port)return;
 if(!confirm(`Remove the picture from ${port.name}?`))return;
 busyImageSave=true;imageButtonsDisabled(true);
 const old=port.image;
 try{port.image='';await saveEditedCard(`Port picture removed from ${port.name}.`)}
 catch(e){port.image=old;say('assetFeedback',e.message,false)}
 finally{busyImageSave=false;imageButtonsDisabled(false)}
}
$('itemInputs').addEventListener('input',renderPortPhotos);$('itemOutputs').addEventListener('input',renderPortPhotos);
$('restoreInterface').onclick=async()=>{
 if(currentKind()!=='gear'||$('itemId').value!=='interface'){
  say('assetFeedback','Select Audio Interface in Equipment / Source first.',false);return;
 }
 if(!confirm('Restore the standard audio interface inputs and outputs? Your image and card name will stay the same.'))return;
 const oldInputs=$('itemInputs').value,oldOutputs=$('itemOutputs').value;
 $('itemInputs').value='Combo input 1 (mic / line / instrument)|XLR,TRS,TS\nCombo input 2 (mic / line / instrument)|XLR,TRS,TS';
 $('itemOutputs').value='Stereo line output|TRS\nUSB output|USB';
 try {await saveEditedCard('Audio interface connections restored. Your image has been kept. Reload the student assignment before testing.');}
 catch(e){$('itemInputs').value=oldInputs;$('itemOutputs').value=oldOutputs;say('assetFeedback',e.message,false)}
};
$('saveItem').onclick=async()=>{
 if(busyImageSave)return;
 busyImageSave=true;imageButtonsDisabled(true);
 try{await saveEditedCard()}catch(e){say('assetFeedback',e.message,false)}
 finally{busyImageSave=false;imageButtonsDisabled(false)}
};
function gradeExplanation(x){
 const raw=Number(x.rawScore??x.score??0), penalty=Number(x.penaltyApplied||0);
 const preFloor=Number(x.calculatedScore??Math.max(0,raw-penalty));
 const floorApplied=x.gradeFloorApplied??(Number(x.score)===50&&preFloor<50);
 const pieces=[...(x.equipmentTotal?[`Equipment: ${Number(x.equipmentCorrect)||0}/${Number(x.equipmentTotal)||0}`]:[]),`Connections: ${Number(x.correct)||0}/${Number(x.total)||0}`,`Raw: ${raw}%`,`Attempt ${Number(x.attempt)||1} deduction: −${penalty}`,`After deduction: ${preFloor}%`];
 if(floorApplied)pieces.push('50% equity floor applied');
 else pieces.push('No floor adjustment');
 pieces.push(`Recorded: ${x.score}%`);
 return pieces.join(' · ');
}
// Keep the submission history on the server, but display/export only the best
// *recorded* grade (after attempt penalty and equity floor) per student/assignment.
function highestGrades(rows){
 const best=new Map();
 for(const x of rows){
  const key=JSON.stringify([String(x.assignment||x.title||'').trim().toLowerCase(),String(x.firstName||x.alias||'').trim().toLowerCase(),String(x.classPeriod||'Legacy').trim().toLowerCase()]);
  const previous=best.get(key);
  if(!previous || Number(x.score||0)>Number(previous.score||0) || (Number(x.score||0)===Number(previous.score||0) && String(x.submittedAt||'')>String(previous.submittedAt||'')))best.set(key,x);
 }
 return [...best.values()].sort((a,b)=>String(b.submittedAt||'').localeCompare(String(a.submittedAt||'')));
}
async function refreshResults(){try{const r=await api('results');const submissions=r.results||[];results=highestGrades(submissions);$('resultsRows').innerHTML=results.map(x=>`<tr><td>${esc(new Date(x.submittedAt).toLocaleString())}</td><td>${esc(x.title)}</td><td>${esc(x.firstName||x.alias||'')}</td><td>${esc(x.classPeriod||'Legacy')}</td><td>${esc(x.mode||'assessment')}</td><td>${x.attempt||1}</td><td><b>${x.score}%</b></td><td>${x.penaltyApplied||0}</td><td>${x.correct}/${x.total}</td><td class="gradeExplain">${esc(gradeExplanation(x))}</td><td><button type="button" class="resetGradeAttempts" data-id="${esc(x.assignment||'')}" data-name="${esc(x.firstName||'')}" data-class="${esc(x.classPeriod||'')}">Reset attempts</button></td></tr>`).join('');say('resultsFeedback',results.length+' student/assignment grades shown (highest final grade after penalties and equity floor). '+submissions.length+' submissions retained in history. CSV exports the same highest grades.')}catch(e){say('resultsFeedback',e.message,false)}}
$('refreshResults').onclick=refreshResults;
$('downloadCsv').onclick=()=>{const rows=[['Date','Assignment','First name','Class period','Mode','Attempt','Score','Penalty','Correct','Total','Grade explanation','Raw score','Pre-floor score','Equity floor applied'],...results.map(r=>[r.submittedAt,r.title,r.firstName||r.alias||'',r.classPeriod||'Legacy',r.mode||'assessment',r.attempt||1,r.score,r.penaltyApplied||0,r.correct,r.total,gradeExplanation(r),r.rawScore??r.score,r.calculatedScore??Math.max(0,Number(r.rawScore??r.score)-Number(r.penaltyApplied||0)),r.gradeFloorApplied??false])];const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/^[=+@-]/,"' $&").replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='monoize-results.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
init();

async function resetStudentAttempts(id,firstName,classPeriod){
 if(!id||!firstName||!classPeriod){say('attemptResetFeedback','Choose a valid assignment, first name, and class.',false);return}
 if(!confirm(`Reset today's attempts for ${firstName} (${classPeriod}) in ${id}? This will let the student start at attempt 1 again. Previous grades will stay saved.`))return;
 try{const r=await api('reset-attempts',{id,firstName,classPeriod});say('attemptResetFeedback',r.message,true);await refreshResults();}
 catch(e){say('attemptResetFeedback',e.message,false)}
}
$('resetAttempts').onclick=()=>resetStudentAttempts($('resetAssignment').value.trim(),$('resetFirstName').value.trim(),$('resetClass').value);
$('deleteAllGrades').onclick=async()=>{
 if(!confirm('Are you sure you want to permanently DELETE ALL grades for ALL students and assignments? This cannot be undone.'))return;
 try{
  const r=await api('delete-all-grades',{confirmation:'DELETE ALL GRADES'});
  await refreshResults();say('attemptResetFeedback',r.message,true);
 }catch(e){say('attemptResetFeedback',e.message,false)}
};
$('resultsRows').addEventListener('click',e=>{
 const reset=e.target.closest('button.resetGradeAttempts');
 if(reset)resetStudentAttempts(reset.dataset.id,reset.dataset.name,reset.dataset.class);
});
