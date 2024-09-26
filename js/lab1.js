let myarray=['apple','grape','orrange','watermelon','tomato'];
function printElement(array,index2,index3){
    console.log(array[index2],array[index3]);
}
printElement(myarray,1,2);

let PlayerScore=0;
function AddNumber(){
    return PlayerScore+=2;
}
function Display(number){
    if(number%2==0){
        console.log("this is a even");
    }
    else{
        console.log("this is a odd");
    }
}

Display(AddNumber());
