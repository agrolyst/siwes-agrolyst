/* Shared applicant sidebar for every authenticated SIWES page. */
(function(global){
"use strict";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icons={
overview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
application:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg>',
letters:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8l4 4v14H4V7z"/><path d="M16 3v5h4M8 12h8M8 16h5"/></svg>',
documents:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>',
help:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1-1.9 1.4-1.9 3M12 17h.01"/></svg>',
signout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>'};
function sidebar(userOrName,active){
const user=userOrName&&typeof userOrName==="object"?userOrName:null;
const name=user?(user.user_metadata?.full_name||user.user_metadata?.name||user.email||"Applicant"):(userOrName||"Applicant");
const initials=String(name).split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"A";
const m=user?.user_metadata||{},identity=(Array.isArray(user?.identities)?user.identities:[]).find(x=>x?.provider==="google")?.identity_data||{};
const photo=m.avatar_url||m.picture||m.profile_image_url||m.photo_url||m.avatar||m.photo||m.image||identity.avatar_url||identity.picture||"";
const avatar=photo?'<img class="dash-avatar" src="'+esc(photo)+'" alt="'+esc(name)+' profile photo" referrerpolicy="no-referrer" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><div class="dash-avatar" aria-hidden="true" style="display:none">'+esc(initials)+'</div>':'<div class="dash-avatar" aria-hidden="true">'+esc(initials)+'</div>';
const item=(key,href,label,icon)=>'<a class="dash-nav '+(active===key?'active':'')+'" href="'+href+'" '+(active===key?'aria-current="page"':'')+'>'+icon+'<span>'+label+'</span></a>';
return '<aside class="dash-side" aria-label="Applicant workspace navigation"><div class="dash-profile">'+avatar+'<div><strong>'+esc(name)+'</strong><span>'+esc(user?.email||"SIWES Applicant")+'</span></div></div><div class="dash-nav-label">WORKSPACE</div><nav class="dash-nav-list" aria-label="Applicant pages">'+item("overview","/dashboard/","Overview",icons.overview)+item("application","/compliance/","My application",icons.application)+item("letters","/acceptance-letter/","Acceptance letter",icons.letters)+item("documents","/documents/","My documents",icons.documents)+'</nav><div class="dash-side-bottom"><div class="dash-help">'+icons.help+'<strong>Need help?</strong><p>Check the programme guide or contact the Agrolyst team.</p><a href="/#faq">View FAQs →</a></div><button type="button" id="signout" class="dash-signout">'+icons.signout+'<span>Sign out</span></button></div></aside>';
}
async function loadProfilePhoto(user){
try{const db=global.agrolystSupabase;if(!db||!user?.id)return;const profile=document.querySelector(".dash-profile");if(!profile)return;
const{data:docs,error}=await db.from("siwes_documents").select("storage_path,uploaded_at").eq("user_id",user.id).eq("document_type","passport_photo").order("uploaded_at",{ascending:false}).limit(1);
if(error||!docs?.[0]?.storage_path)return;const{data:signed,error:signError}=await db.storage.from("siwes-private").createSignedUrl(docs[0].storage_path,3600);if(signError||!signed?.signedUrl)return;
const img=document.createElement("img");img.className="dash-avatar";img.alt="Applicant profile photo";img.referrerPolicy="no-referrer";img.src=signed.signedUrl;img.onerror=()=>img.remove();const old=profile.querySelector(".dash-avatar");if(old)old.replaceWith(img);
}catch(e){console.warn("Applicant profile image could not be loaded.",e)}
}
global.AgrolystApp={sidebar,loadProfilePhoto};
})(window);
