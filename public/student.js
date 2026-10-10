import {$,api,notice,Board} from './core.js';
const board=new Board();let assignment=null;const start=new URLSearchParams(location.search).get('assignment')||'demo';
async function load(){try{const data=await api('play?id='+encodeURIComponent(start));assignment=data.assignment;board.allowed=assignment.allowed;board.setCatalog(data.gear,data.cables);board.setNodes(assignment.nodes);$('title').textContent=assignment.title;$('instructions').textContent=assignment.instructions;notice('Ready. Select a gold output port and then a blue input port.',true)}catch(e){$('title').textContent='Unable to load assignment';notice(e.message)}}
$('reset').onclick=()=>{if(assignment){board.setNodes(assignment.nodes);notice('Layout reset.',true)}};
$('submit').onclick=async()=>{if(!assignment)return;const alias=$('alias').value.trim();if(alias.length<2){notice('Enter a classroom alias / code first.');return}try{const r=await api('submit',{id:assignment.id,alias,edges:board.links});notice(`Submitted! Score: ${r.score}%. ${r.correct}/${r.total} correct connections. Receipt: ${r.receipt}`,true)}catch(e){notice(e.message)}};
load();
