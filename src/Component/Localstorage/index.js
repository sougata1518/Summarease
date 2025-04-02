// doLogin 
export const doLogin = async (data,next) =>{
    await localStorage.setItem("user-innovator",JSON.stringify(data))
    next()
}

// doLogout
export const doLogout = () =>{
    localStorage.removeItem("user-innovator");
}

// isLoggedIn
export const isLoggedIn = () =>{
    let data = localStorage.getItem("user-innovator");
    if(data == null){
        return false;
    } 
    else{
        return true;
    }
}

// getToken
export const getToken = () =>{
    if(isLoggedIn()){
        return JSON.parse(localStorage.getItem("user-innovator")).jwtToken;
    }else{
        return null;
    }
}

