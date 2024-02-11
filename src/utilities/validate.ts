import isEmail from "validator/lib/isEmail";
import matches from "validator/lib/matches";
import isMobilePhone from "validator/lib/isMobilePhone";

interface validateReturns {
	ok: boolean;
	message: string;
}

export function validatePassword(password: string): validateReturns {
	// Password should be at least 8 characters long, contain at least one uppercase letter,
	// one lowercase letter, one digit, and one symbol
	var regex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?!.*\s)[A-Za-z\d@$!%*?&]{8,}$/;

	const test = regex.test(password);

	if (test) {
		return {
			ok: true,
			message: "password is valid",
		};
	} else {
		return {
			ok: false,
			message:
				"Make sure your password contains at least 8 characters long, one uppercase letter, one lowercase letter, one digit, one symbol and no SPACES. at least!",
		};
	}
}

export function validateEmail(email: string): validateReturns {
	// check if the Email is valid
	if (!email || !isEmail(email)) {
		return {
			ok: false,
			message:
				"The provided Email is either unvalid or not provided at all",
		};
	} else {
		return {
			ok: true,
			message: "Email is valid.",
		};
	}
}

export function validateUsername(username: string): validateReturns {
	if (!username || username.length > 10 || username.length < 3 || !matches(username, "^[a-zA-Z0-9_.]*$") ) {
		return {
			ok: false,
			message:
				"The provided username is either unvalid or not provided at all",
		};
	} else {
		return {
			ok: true,
			message: "Username is valid.",
		};
	}
}

export function validatePhoneNumber(phoneNumber: string): validateReturns {
	if (!phoneNumber || !isMobilePhone(phoneNumber, "ar-SA")) {
		return {
			ok: false,
			message:
				"The provided Phone number is either unvalid or not provided at all",
		};
	} else {
		return {
			ok: true,
			message: "Phone number is valid.",
		};
	}
}

export function validateName(name: string): validateReturns {
	if (!name || name.length > 26 || name.length < 6) {
		return {
			ok: false,
			message:
				"The provided Name is either unvalid or not provided at all",
		};
	} else {
		return {
			ok: true,
			message: "Name is valid.",
		};
	}
}

interface validateParams {
	email?: string;
	username?: string;
	name?: string;
	password?: string;
	phone?: string;
}

export function validate(obj:validateParams): validateReturns {
	const { email, username, name, password, phone } = obj;
    const validatings= [
        {_element: "email", element: email, elementValidate: validateEmail},
        {_element: "username", element: username, elementValidate: validateUsername},
        {_element: "name", element: name, elementValidate: validateName},
        {_element: "password", element: password, elementValidate: validatePassword},
        {_element: "phoneNumber", element: phone, elementValidate: validatePhoneNumber},
	];

    let errList = validatings.map((elements =>{
        const {_element, element, elementValidate} = elements;
        if (obj.hasOwnProperty(_element)) {
            const VElementRes = elementValidate(element);
            if(!VElementRes.ok) return VElementRes.message
        }
    }))

    // it uses filter to filter the undefined proberties
    errList = errList.filter(value => value );
    return{
        ok: errList.length > 0 ? false : true,
        message: errList.length > 0 ? errList.join('...') : "The attrs you provided are valid."
    }
}
