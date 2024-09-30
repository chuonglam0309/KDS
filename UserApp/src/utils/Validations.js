//validate user
export const isValidUser = (Username) => (/^[a-zA-Z0-9]{5,20}$/.test(Username))

// validate email
export const isValidEmail = (Email) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email))


//validate password
export const isValidPassword = (stringPassword) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(stringPassword)
//validate numberphoneVN
// export const isValidVnPhone = (numberPhone) => (/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(numberPhone))

export const isValidVnPhone = (numberPhone) => (/(03|05|07|08|09)+([0-9]{8})\b/.test(numberPhone))
export const validateDevicename = (stringname) => {
  if (stringname.length != 0)
    return true;
  else {
    return false;
  }
}



export const checkBirthday = (currentDate, selectDate) => {
  if ((currentDate.getUTCFullYear() - selectDate.getUTCFullYear()) > 14) {
    return true
  }
  else{
    return false
  }


}

