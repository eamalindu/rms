window.addEventListener('load',()=>{
    resetLecturerForm();
    refreshLecturerTable();
});

const resetLecturerForm = () => {}

const refreshLecturerTable = () => {
    const lecturers = ajaxGetRequest("/Lecturer/findall")
}