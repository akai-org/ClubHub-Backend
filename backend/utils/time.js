function getCurrTime(){
    var currentdate = new Date(); 
    var datetime = "[" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "T"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "]";
    return datetime; 
}

module.exports = {getCurrTime}