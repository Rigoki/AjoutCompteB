/*Variables*/
let input = document.querySelectorAll('form input');
let errTxt = document.querySelectorAll('small.errtxt');
let btnConf = document.getElementById('conf');
let btnCancel = document.getElementById('annuler');
let errMsg = ["Veuillez saisir un compte bancaire valide", "Veuillez saisir un code guichet valide", "La clé RIB n'est pas valide"];
let error = false;
let account = document.getElementById("account");
const reg = new RegExp('^[0-9]+$');
let carNumCompte = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let corHollerith = "12345678912345678923456789";

/*Event*/
btnCancel.addEventListener('click', () => {
    for (let i = 0; i < errTxt.length; i++) {
        errTxt[i].style.display = "none";
        input[i].classList.remove('error');
    }
})
btnConf.addEventListener('click', () => {
    isFormValid();
    if (error == true) {
        event.preventDefault();
    }
})
for (let i = 0; i < 2; i++) {
    input[i].addEventListener('blur', () => {
        if (reg.test(input[i].value)) { input[i].value = AddZero(input[i].value, 5); }
    })
}
input[2].addEventListener('blur', () => {
    input[2].value = input[2].value.toUpperCase();
})

account.addEventListener('blur', () => {
    account.value = AddZero(account.value, 11);
})

//fonctions
function IsOnlyNumbers(e, f, g) {
    if (e.value != '' && !reg.test(e.value)) {
        f.innerHTML = g;
        f.style.display = "block";
        error = true;
        e.classList.add("error");
    }
    return error;
}
//fonction pour ajouter les 0 manquants
function AddZero(num, i) {
    return num.toString().padStart(i, "0");
}
//Fonction pour contrôler si les champs sont vides
function isVoid(e, f) {
    if (e.value == "") {
        e.classList.add("error");
        f.style.display = "block";
        f.innerHTML = "Champs obligatoire";
        error = true;
    } else {
        f.style.display = "none";
        e.classList.remove("error");
        error = false;
    } return error;
}
//Contrôle du nombre de caractères
function charNumbCheck(e, f, g) {
    if (e.value.length > g) {
        e.classList.add("error");
        f.style.display = "block";
        f.innerHTML = `Veuillez ne pas saisir plus de ${g} caractères`;
        error = true;
    }

    return error;
}
//Contrôle spécifique au Libellé de compte
function isLibelleValid(e, err, min, max) {
    if (e.value.length != 0) {
        if (e.value.length < min || e.value.length > max) {
            err.style.display = "block";
            err.innerHTML = `Veuillez saisir un libellé comprennant entre ${min} et ${max} caractères`;
            error = true;
        }
        return error;
    }
}
//Calcule clé de rib
//Input[2].value est le numéro de compte
function isRibValid() {
    let accountNumber = input[2].value;
    for (let i = 0; i < accountNumber.length; i++) {
        if (isNaN(accountNumber.charAt(i)))
            for (let j = 0; j < 26; j++) {
                if (accountNumber.charAt(i) === carNumCompte.charAt(j)) {
                    let carAlpha = accountNumber.charAt(i);
                    let carReplace = corHollerith.charAt(j);
                    accountNumber = accountNumber.replace(carAlpha, carReplace);
                }
            }
    }
    //Input[0] est le code banque [1] est le code guichet
    let N = `${input[0].value}${input[1].value}${accountNumber}`;
    let N100 = N + "00"
    let middle = Math.floor(N100.length / 2);
    N1 = N100.substring(0, middle);
    N2 = N100.substring(middle);
    N3 = N1 % 97;
    N4 = (N3 + N2) % 97;
    let K = 97 - N4;
    // L'index 3 est lié à la clé de RIB
    if (K != input[3].value && input[3].value != "") {
        error = true;
        errTxt[3].style.display = "Block";
        errTxt[3].innerHTML = "Clé RIB invalide veuillez vérifier tout les champs";
        input[3].classList.add("error");
        return error;
    }
}

//Contrôle du formulaire
function isFormValid() {
    for (let i = 0; i < input.length; i++) {
        isVoid(input[i], errTxt[i]);
    }
    let inputOnlyNumber = [input[0], input[1], input[3]];
    let errTxtNumber = [errTxt[0], errTxt[1], errTxt[3]]
    for (let j = 0; j < inputOnlyNumber.length; j++) {
        IsOnlyNumbers(inputOnlyNumber[j], errTxtNumber[j], errMsg[j]);
    }
    let maxChar = [5, 5, 11, 2];

    for (let i = 0; i < 4; i++) {
        charNumbCheck(input[i], errTxt[i], maxChar[i]);
    }
    isLibelleValid(input[4], errTxt[4], 3, 50);
    isRibValid();
    return error;
}
//Console logs
console.log("list des input", input);
console.log("list des msg", errTxt);