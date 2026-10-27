/* Shared applicant sidebar for every authenticated SIWES page. */
(function(global){
"use strict";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icons={
overview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>',
application:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v5h4M10 13h6M10 17h6"/></svg>',
letters:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3h12v18l-6-3-6 3z"/><path d="M9 8h6M9 12h6"/></svg>',
help:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1-2 1.4-2 3M12 17h.01"/></svg>',
signout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/></svg>'};
function sidebar(userOrName,active){
const user=userOrName&&typeof userOrName==="object"?userOrName:null;
const name=user?(user.user_metadata?.full_name||user.user_metadata?.name||user.email||"Applicant"):(userOrName||"Applicant");
const initials=String(name).split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"A";
const m=user?.user_metadata||{},identity=(Array.isArray(user?.identities)?user.identities:[]).find(x=>x?.provider==="google")?.identity_data||{};
const photo=m.avatar_url||m.picture||m.profile_image_url||m.photo_url||m.avatar||m.photo||m.image||identity.avatar_url||identity.picture||"";
const avatar=photo?'<img class="dash-avatar" src="'+esc(photo)+'" alt="'+esc(name)+' profile photo" referrerpolicy="no-referrer" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><div class="dash-avatar" aria-hidden="true" style="display:none">'+esc(initials)+'</div>':'<div class="dash-avatar" aria-hidden="true">'+esc(initials)+'</div>';
const item=(key,href,label,icon)=>'<a class="dash-nav '+(active===key?'active':'')+'" href="'+href+'" '+(active===key?'aria-current="page"':'')+'>'+icon+'<span>'+label+'</span></a>';
return '<aside class="dash-side" aria-label="Applicant workspace navigation"><div class="dash-profile">'+avatar+'<div><strong>'+esc(name)+'</strong><span>'+esc(user?.email||"SIWES Applicant")+'</span></div></div><div class="dash-nav-label">WORKSPACE</div><nav class="dash-nav-list" aria-label="Applicant pages">'+item("overview","/dashboard/","Overview",icons.overview)+item("application","/compliance/","My application",icons.application)+item("letters","/acceptance-letter/","Letters &amp; documents",icons.letters)+'</nav><div class="dash-side-bottom"><div class="dash-help">'+icons.help+'<strong>Need help?</strong><p>Check the programme guide or contact the Agrolyst team.</p><a href="/#faq">View FAQs →</a></div><button type="button" id="signout" class="dash-signout">'+icons.signout+'<span>Sign out</span></button></div></aside>';
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
