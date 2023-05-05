const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_-+={[}]|<,>/.?';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");


// Set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( ( passwordLength-min)*100/(max-min))+ "% 100%";
    
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = '0px 0px 12px 1px grey';
}

function getRandomInteger(min,max){
  return   Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowerCase(){
   return String.fromCharCode(getRandomInteger(97,120));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,90));
}
function generateSymbol(){
    const randomNumber = getRandomInteger(0,symbols.length);
    return symbols.charAt[randomNumber];
}

function calculateStrenght(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbercheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8 ){
        setIndicator("#0f0");

    }else if((hasLower || hasUpper) && (hasNum || hasSym) &&
    passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
   
}

function shufflePassword(array){
    //fisher yates method
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;


}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
         if(checkbox.checked)
         checkCount++;
    });
    //special condition
    if(passwordLength <checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener("change" , handleCheckBoxChange);
})

inputSlider.addEventListener("input" , (e) => {
     passwordLength = e.target.value;
     handleSlider();
})

copyBtn.addEventListener("click" , () =>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener("click", () =>{
    //none of the checkbox are seleced
    if(checkCount <= 0)
    return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //let start new journey to find new password
    //remove old password

    password = "";
    //let put the stuff mentioned by checkboxes

    // if(upperCaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbercheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];
    if(upperCaseCheck.checked)
      funArr.push(generateUpperCase);


    if(lowerCaseCheck.checked)
      funArr.push(generateLowerCase);

    if(numbercheck.checked)
      funArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
      funArr.push(generateSymbol);


      //compulsory addition

      for(let i =0;i<funArr.length;i++){
         password += funArr[i]();
      }

      //Remaining addition
     for(let i = 0;i<passwordLength-funArr.length;i++){
        let randomindex = getRandomInteger(0,funArr.length);
        password += funArr[randomindex]();
     }

     //shuffle the password 
     password = shufflePassword(Array.from(password));

     passwordDisplay.value = password;

     //calculation strength
     calculateStrenght();


})