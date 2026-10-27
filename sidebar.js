/* One shared applicant sidebar for every authenticated SIWES page. */
(function(){
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const icons = {
    overview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    application:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v5h4M10 13h6M10 17h6"/></svg>',
    letters:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h12v18l-6-3-6 3z"/><path d="M9 8h6M9 12h6"/></svg>'
  };
  function render(user, active){
    const name=user?.user_metadata?.full_name||user?.user_metadata?.name||user?.email||"Applicant";
    const email=user?.email||"Applicant account";
    const initials=name.split(" ").filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase()||"A";
    const metadata=user?.user_metadata||{};
    const identities=Array.isArray(user?.identities)?user.identities:[];
    const identityData=identities.find(item=>item?.provider==="google")?.identity_data||identities[0]?.identity_data||{};
    const photo=metadata.avatar_url||metadata.picture||metadata.profile_image_url||metadata.photo_url||metadata.avatar||metadata.photo||metadata.image||metadata.profile_photo||metadata.profilePicture||identityData.avatar_url||identityData.picture||identityData.photo_url||identityData.image_url||identityData.avatar||"";
    const avatar=photo?'<img class="dash-avatar" src="'+esc(photo)+'" alt="'+esc(name)+' profile photo" referrerpolicy="no-referrer" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><div class="dash-avatar" aria-hidden="true" style="display:none">'+esc(initials)+'</div>':'<div class="dash-avatar" aria-hidden="true">'+esc(initials)+'</div>';
    const item=(key,href,label,icon)=>'<a class="dash-nav '+(active===key?'active':'')+'" href="'+href+'" '+(active===key?'aria-current="page"':'')+'>'+icon+'<span>'+label+'</span></a>';
    return '<aside class="dash-side" aria-label="Applicant navigation"><div class="dash-profile">'+avatar+'<div><strong>'+esc(name)+'</strong><span>'+esc(email)+'</span></div></div><div class="dash-nav-label">WORKSPACE</div><nav class="dash-nav-list" aria-label="Applicant pages">'+item("overview","/dashboard/","Overview",icons.overview)+item("application","/compliance/","My application",icons.application)+item("letters","/acceptance-letter/","Letters &amp; documents",icons.letters)+'</nav><div class="dash-side-bottom"><div class="dash-help"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1-1.9 1.4-1.9 3M12 17h.01"/></svg><strong>Need a hand?</strong><p>Find answers about your SIWES application and next steps.</p><a href="/#faq">Visit FAQs →</a></div><button id="signout" class="dash-signout" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg><span>Sign out</span></button></div></aside>';
  }
  window.AgrolystSidebar={render};
})();