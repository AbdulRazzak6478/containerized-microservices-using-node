
function compareTime(stringTime1,stringTime2)
{
    const dateTime1 = new Date(stringTime1);
    const dateTime2 = new Date(stringTime2);

    // console.log("date1 is : ",dateTime1.getTime());
    // console.log("date2 is : ",dateTime2.getTime());
    console.log(dateTime1.getHours() , dateTime1.getMinutes(),dateTime1.getSeconds());
    console.log(dateTime2.getHours() , dateTime2.getMinutes(),dateTime2.getSeconds());
    
    return dateTime1.getTime() > dateTime2.getTime();
}
function handler()
{
    const num = 4
    console.log(isNaN('fgh'));
    console.log( parseInt('234ay'));
    if(!NaN)
        console.log('true');

}

// handler()

// compareTime('2023-09-13 14:30:00','2023-08-13 10:30:00');
// console.log(compareTime('2023-09-13 07:20:00','2023-09-13 08:30:00'));

module.exports = {
    compareTime,
}