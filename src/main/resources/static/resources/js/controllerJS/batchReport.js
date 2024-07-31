window.addEventListener('load',()=>{

    resetSearchBar();
});

const resetSearchBar = ()=>{
    const courses = ajaxGetRequest("/Course/findall");

}