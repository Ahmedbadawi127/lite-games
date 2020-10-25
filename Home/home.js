$(function () {
    $("#addData").submit(function (event) {
        event.preventDefault()
        stdData = {
            name: $("#name").val(),
            pass: $("#pass").val(),
            mail: $("#mail").val()
        }
        $.ajax({
            url: "http://localhost:8081/addUser",
            method: "POST",
            data: stdData,
            success: function () {
                console.log("done")
                alert("You have registered")
            },
            error: function () {
                console.log("fail")
            }
        })
    })
})




// login js


function emptyFields() {
    document.$("#namelogin").value = ""
    document.$("#passlogin").value = ""
    var user_name = ""
    var password_user = ""
    sessionStorage.removeItem('currenLoginUser')
}

   
    
    $(function () {
        $("#getData").submit(function (event) {
       console.log("new")
       var user_name=$("#namelogin").value
       console.log(user_name)
           
        })
    })


    function emptyFields()
    {
        document.getElementById('namelogin').value = ""
        document.getElementById('Passlogin').value = ""
        var user_name=""
        var password_user=""
        sessionStorage.removeItem('currenLoginUser')
    }
    
    function setAction(form)
    {
        var user_name=document.getElementById('namelogin').value
        var password_user=document.getElementById('Passlogin').value
        var noSigIn=false
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200)
            {
            var UserData = JSON.parse(xmlhttp.responseText);
            for(i = 0; i < UserData.length; i++)
            {
               
               if(user_name==data[i].name && password_user==data[i].pass)
                   {
                      console.log('user name '+user_name)
                      console.log('password' + password_user) 
                      console.log('sueccssful')
                      alert('تم التاكد من الاسم والباسورد تفضل للدخول')
                      sessionStorage.removeItem('currenLoginUser')
                      sessionStorage.setItem('currenLoginUser', data[i].name)

            }
            if(noSigIn==false)
            {
                alert('يوجد خطا فى الاسم او الباسورد ')
            }
    
            }
        };
        xmlhttp.open("GET", "Data.json", true);
        xmlhttp.send();
    }
    
    function goSignUp(){
        window.location.replace("#myModal3")   
    }


}
