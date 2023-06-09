$(document).ready(() => {
    
    ClearFrom();

    if(JSON.parse(sessionStorage.getItem("USER")) != null || JSON.parse(sessionStorage.getItem("USER")) != undefined){
        FillLoginForm();
    }

    //Changing between forms
    $("#login-change").click(() => ShowSignIn());
    $("#sign-change").click(() => ShowLogin());

    //submit buttons
    $("#login-submit").click((e) => {
        e.preventDefault();
        $(".needs-validation").addClass("was-validated");
        const data = TakeDataFromLoginIn();
        //console.log(data);
        if(ValidateLogin(data) && ValidateUser(data)){
            if(data.remember == true){
                SetDataInSessionStorage(data);
            } else {
                sessionStorage.removeItem('USER');
            }
            StoreDetailsOfUserInSessionStorage(data.id);
            $("#__buttons").addClass("hide");
            $("#__profile").removeClass("hide");
            CloseForm();
        }
    })

    $("#signup-submit").click((e) => {
        e.preventDefault();
        $(".needs-validation").addClass("was-validated");
        const data = TakeDataFromSignUp();
        if (ValidateFormSignIn(data)) {
            delete data.password2;
            StoreData(data);
            $("#__buttons").addClass("hide");
            $("#__profile").removeClass("hide");
            CloseForm();
        }
    })

    $("#changeImage").click(()=>{
        const x = $("#profile-pic-preview").attr("src");
        const defaultImage = "data:image/png;base64,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";
        if(x == defaultImage){
            RemoveUserImage(GetCurrentUserData().email);
            $("#profile-pic").attr("src",defaultImage);
        } else {
            const data = GetCurrentUserData();
            $("#profile-pic").attr("src",x);
            const imageData = {id : data.email, image : x};
            StoreImage(imageData);
            
        }
        CloseForm();
    })

    $("#update-data-form").click(() => {
        const data = TakeDataFromForm();
        if(ValidateForm(data)){
            UpdateProfile(data);
            CloseForm();
            UpdateUserNameInPage();
        }
    })

    //toast setting 
    $(".toast > div > button").click(() => {
        $('.toast').removeClass('show');
        $('.toast').addClass('hide');
    })

    $(".login-txt").click(ShowLogin);
    $(".sign-in-txt").click(ShowSignIn);
    $(".close-form").click(CloseForm);
    $("#write").click(ShowEditForm);
    $("#profile-pic").click(ShowImageSection);

    $("#editPass").click(() => {
        $("#editPass:checked").val() == undefined ? $("#Password").attr("readonly", true) : $("#Password").attr("readonly", false);
    })

    $("#UploadImage").click(ShowImageSection);

    $("#logout").click(() => {
        $("#__buttons").removeClass("hide");
        $("#__profile").addClass("hide");
    });
})


function ShowImageSection(){
    FillImage();
    $("#main-section").addClass("blur");
    $("#edit-profile-form").addClass("hide");
    $("#upload-image-section").removeClass('hide');
}

function ShowEditForm() {
    FillForn();
    $("#main-section").addClass("blur");
    $("#edit-profile-form").removeClass("hide");
    $("#upload-image-section").addClass('hide');
}

function UpdateUserNameInPage() {
    $("#write").text(`Hello ${GetUsername()} !`);
    $("#profile-pic").attr("src",GetImageById(GetCurrentUserData().email));
}

function CloseForm(){
    $(".login").addClass("hide");
    $(".SingnIn").addClass("hide");
    $("#edit-profile-form").addClass("hide");
    $("#upload-image-section").addClass("hide");
    ClearForm();
}

function ShowSignIn() {
    Ref.Login.addClass("hide");
    Ref.Signin.removeClass("hide");
    $('.toast').addClass('hide');
    $(".needs-validation").removeClass("was-validated");
    ClearFrom();
}

function ShowLogin() {
    Ref.Login.removeClass("hide");
    Ref.Signin.addClass("hide");
    $('.toast').addClass('hide');
    $(".needs-validation").removeClass("was-validated");
    ClearFrom();
    
}

function ShowToastWithMessag(msg) {
    console.log(msg);
    $(".toast-body").html(msg);
    $(".toast").removeClass("hide");
    $(".toast").addClass("show");
}

function TakeDataFromSignUp() {
    const name = SingninForm.Username.val();
    const email = SingninForm.Email.val();
    const bddate = SingninForm.BDDate.val();
    const pass = SingninForm.Password1.val();
    const pass2 = SingninForm.Password2.val();
    const gender = $(".SingnIn input[type='radio']:checked").val();
    
    const data = { username: name, email: email, bddate: bddate, password: pass, password2: pass2, gender: gender }
    return data;
}

function TakeDataFromLoginIn(){
    const id = LoginForm.Email.val();
    const pass = LoginForm.Password.val();
    const remember = $("#check:checked").val() == undefined ? false:true;
    const data = { id : id, Password : pass, remember : remember};
    return data;
}

function ValidateFormSignIn(data) {
    console.log(data);
    if (data.username == "" && data.email == "" && data.bddate == "" && data.password == "" && data.password2 == "") {
        ShowToastWithMessag("Please Fill Form");
        return false;
    } else if (data.username == "") {
        ShowToastWithMessag("Please Enter your name");
        return false;
    } else if (data.email == "") {
        ShowToastWithMessag("Please Enter email");
        return false;
    } else if (data.password == "") {
        ShowToastWithMessag("Please Enter Password");
        return false;
    } else if(data.password != ""){
        if(data.password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$")){
            // do nothing
        } else {
            ShowToastWithMessag("Please Enter Valid Password <br> &nbsp; Min 8 Character <br> &nbsp; Must contain Capital <br> &nbsp; Must contain lower <br> &nbsp; Must Contain Number <br> &nbsp; Must contain spacial Character");
            return false;
        }
    }
    if (data.password2 == "") {
        ShowToastWithMessag("Please Enter Password again");
        return false;
    } else if (data.password != data.password2) {
        ShowToastWithMessag("Please enter same Password");
        return false;
    } else if (data.gender == null || data.gender == undefined || data.gender == "") {
        ShowToastWithMessag("Please Select Gender");
        return false;
    } else if (data.bddate == "") {
        ShowToastWithMessag("Please Enter a Birth date");
        return false;
    } else if (Date.parse(data.bddate) > Date.now()) {
        ShowToastWithMessag("Please Enter Valid date");
        return false;
    }
    return true;
}

function ValidateLogin(data){
    if(data.id == "" && data.Password == ""){
        ShowToastWithMessag("Please fill data")
        return false;
    } else if(data.id == ""){
        ShowToastWithMessag("Please enter username or email id");
        return false;
    } else if(data.Password == ""){
        ShowToastWithMessag("Enter Password");
        return false;
    }
    return true;
}

function ClearFrom() {
    SingninForm.Username.val(null);
    SingninForm.BDDate.val(null);
    SingninForm.Email.val(null);
    SingninForm.Password1.val(null);
    SingninForm.Password2.val(null);
    $(".SingnIn input[type='radio']:checked").prop('checked', false);
    LoginForm.Email.val(null);
    LoginForm.Password.val(null);
    $("#check").prop('checked',false);
}

function FillLoginForm(){
    const data = JSON.parse(sessionStorage.getItem("USER"));
    LoginForm.Email.val(data.id);
    LoginForm.Password.val(data.Password);
}

function TakeDataFromForm() {
    const email = $("#E-mail").val();
    const username = $("#Username").val();
    const pass = $("#Password").val();
    const bddate = $("#BDdate").val();
    const gender = $("#edit-profile-form input[type='radio']:checked").val();

    const data = { user: username, email: email, pass: pass, bddate: bddate, gender: gender };
    return data;
}

function imageUploaded() {
    let base64String = "";
    var file = document.querySelector('input[type=file]')['files'][0];
 
    var reader = new FileReader();
    reader.onload = function () {
        base64String = reader.result;
        $("#profile-pic-preview").attr("src", base64String);
    }
    reader.readAsDataURL(file); 
}


function FillImage() {
    const x = $("#profile-pic").attr("src");
    $("#profile-pic-preview").attr("src",x);
}

function SetDefaultImage(){
    const defaultImage = "data:image/png;base64,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";
    $("#profile-pic-preview").attr("src",defaultImage);
}


function ValidateForm(data) {

    // const data = { user: username, email: email, pass: pass, bddate: bddate, gender: gender };

    console.log(data, "fuck");
    if (data.user == "" && data.email == "" && data.bddate == "" && data.pass == "" ) {
        ShowToastWithMessag("Please Fill Form");
        return false;
    } else if (data.user == "") {
        ShowToastWithMessag("Please Enter your name");
        return false;
    } else if (data.email == "") {
        ShowToastWithMessag("Please Enter email");
        return false;
    } else if (data.pass == "") {
        ShowToastWithMessag("Please Enter Password");
        return false;
    } else if(data.pass != ""){
        if(data.pass.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$")){
            // do nothing
        } else {
            ShowToastWithMessag("Please Enter Valid Password <br> &nbsp; Min 8 Character <br> &nbsp; Must contain Capital <br> &nbsp; Must contain lower <br> &nbsp; Must Contain Number <br> &nbsp; Must contain spacial Character");
            return false;
        }
    } else if (data.gender == null || data.gender == undefined || data.gender == "") {
        ShowToastWithMessag("Please Select Gender");
        return false;
    } else if (data.bddate == "") {
        ShowToastWithMessag("Please Enter a Birth date");
        return false;
    } else if (Date.parse(data.bddate) > Date.now()) {
        ShowToastWithMessag("Please Enter Valid date");
        return false;
    }
    return true;
}