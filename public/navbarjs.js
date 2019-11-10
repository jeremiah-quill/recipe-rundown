function highlightCurrent() {
    const curPage = document.URL;
    const links = document.getElementsByClassName('nav-link');
    for (let link of links) {
      if (link.href == curPage) {
        link.classList.add("current");
      }
    }
  }


  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      highlightCurrent()
    }
  };