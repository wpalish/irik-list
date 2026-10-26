// Owner-authored infrastructure adapted for IrikList.
import {requireThat,problem} from './errors.js';
import {parseStrictJSON} from '../public/strict-json.js';
export {parseStrictJSON};
export async function body(req){
 requireThat(/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||''));
 const bytes=await new Promise((resolve,reject)=>{let size=0,large=false;const chunks=[];req.on('data',chunk=>{size+=chunk.length;if(size>2097152){large=true;chunks.length=0;}else if(!large)chunks.push(chunk);});req.on('end',()=>large?reject(problem(413)):resolve(Buffer.concat(chunks)));req.on('error',()=>reject(problem(400)));req.on('aborted',()=>reject(problem(400)));});
 let source;try{source=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw problem(400);}return parseStrictJSON(source);
}
