/* Agrolyst SIWES shared applicant shell.
   Use AgrolystApp.sidebar(name, active) for any new authenticated page. */
(function (global) {
  "use strict";
  const icons = {
    overview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>',
    application: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v5h4M10 13h6M10 17h6"/></svg>',
    letters: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3h12v18l-6-3-6 3z"/><path d="M9 8h6M9 12h6"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1-2 1.4-2 3M12 17h.01"/></svg>',
    signout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/></svg>'
  };
  function sidebar(name, active) {
    const safeName = String(name || "Applicant").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const initial = (safeName.trim()[0] || "A").toUpperCase();
    const links = [
      ["overview","/dashboard/","Overview",icons.overview],
      ["application","/compliance.html","My application",icons.application],
      ["letters","/acceptance-letter/","Letters & documents",icons.letters]
    ];
    return '<aside class="dash-side" aria-label="Applicant workspace navigation"><div class="dash-profile"><div class="dash-avatar" aria-hidden="true">'+initial+'</div><div><strong>'+safeName+'</strong><span>SIWES Applicant</span></div></div><div class="dash-nav-label">WORKSPACE</div>'+links.map(x=>'<a class="dash-nav'+(active===x[0]?' active':'')+'" href="'+x[1]+'"'+(active===x[0]?' aria-current="page"':'')+'>'+x[3]+x[2]+'</a>').join('')+'<div class="dash-side-bottom"><div class="dash-help">'+icons.help+'<strong>Need help?</strong><p>Check the programme guide or contact the Agrolyst team.</p><a href="/#faq">View FAQs →</a></div><button type="button" id="signout" class="dash-signout">'+icons.signout+'Sign out</button></div></aside>';
  }
  global.AgrolystApp = { sidebar };
})(window);
