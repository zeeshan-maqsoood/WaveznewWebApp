import CryptoJS from "crypto-js";
import SecureStorage from "secure-web-storage";

var SECRET_KEY = process.env.sessionStorageSecretKey;

var secureStorage = new SecureStorage(
    typeof window !== "undefined" && sessionStorage,
    {
        hash: function hash(key) {
            key = CryptoJS.SHA256(key, SECRET_KEY);

            return key.toString();
        },
        encrypt: function encrypt(data) {
            data = CryptoJS.AES.encrypt(data, SECRET_KEY);

            data = data.toString();

            return data;
        },
        decrypt: function decrypt(data) {
            data = CryptoJS.AES.decrypt(data, SECRET_KEY);

            data = data.toString(CryptoJS.enc.Utf8);

            return data;
        },
    }
);

class LocalStore {
    getToken = () => {
        if (typeof window !== "undefined") {
            const token = secureStorage.getItem("WaveToken") || "";
            return token;
        }
        return "";
    };
    setToken = (token) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("WaveToken", token);
        }
    };

    getUserInitials = () => {
        if (typeof window !== "undefined") {
            const initials = secureStorage.getItem("UserInitials") || "";
            return initials;
        }
        return "";
    };
    setUserInitials = (initials) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("UserInitials", initials);
        }
    };

    getUserLoggedInData = () => {
        if (typeof window !== "undefined") {
            const loggedData = secureStorage.getItem("UserLoggedData") || "";
            if (loggedData) {
                return JSON.parse(loggedData);
            }
        }
        return "";
    };
    setUserLoggedInData = (loggedData) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("UserLoggedData", JSON.stringify(loggedData));
        }
    };

    getAdminNavBarStatus = () => {
        if (typeof window !== "undefined") {
            try {
                const _adminNavBarStatus = secureStorage.getItem("AdminNavStatus");
                if (_adminNavBarStatus !== "undefined") {
                    console.log('GET', _adminNavBarStatus);
                    return _adminNavBarStatus;
                }
            } catch (er) {
                return "";
            }
        }
        return false;
    };
    setAdminNavBarStatus = (_adminNavBarStatus) => {
        if (typeof window !== "undefined") {
            console.log('SET', _adminNavBarStatus);
            secureStorage.setItem("AdminNavStatus", _adminNavBarStatus);
        }
    };

    getFavourite = () => {
        if (typeof window !== "undefined") {
            try {
                const favourite = secureStorage.getItem("Favourite") || "";
                return favourite;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setFavourite = (favourite) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("Favourite", favourite);
        }
    };

    getCandidate = () => {
        if (typeof window !== "undefined") {
            try {
                const candidate = secureStorage.getItem("Candidate") || "";
                return candidate;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setCandidate = (candidate) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("Candidate", candidate);
        }
    };

    getLocation = () => {
        if (typeof window !== "undefined") {
            try {
                const location = secureStorage.getItem("Location") || "";
                return location;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setLocation = (location) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("Location", location);
        }
    };

    getConfiguration = () => {
        if (typeof window !== "undefined") {
            try {
                const configuration = secureStorage.getItem("Configuration") || "";
                return configuration;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setConfiguration = (configuration) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("Configuration", configuration);
        }
    };

    getTheme = () => {
        if (typeof window !== "undefined") {
            try {
                const theme = secureStorage.getItem("Theme") || "";
                return theme;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setTheme = (theme) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("Theme", theme);
        }
    };

    getRole = () => {
        if (typeof window !== "undefined") {
            try {
                const role = secureStorage.getItem("Role") || "";
                return role;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setRole = (role) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("Role", role);
        }
    };

    getCode = () => {
        if (typeof window !== "undefined") {
            try {
                const role = secureStorage.getItem("Code") || [];
                return role;
            } catch (er) {
                return [];
            }
        }
        return "";
    };
    setCode = (code) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("Code", code);
        }
    };

    getUserDetail = () => {
        if (typeof window !== "undefined") {
            try {
                const detail = secureStorage.getItem("UserDetail") || "";
                return detail;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setUserDetail = (detail) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("UserDetail", detail);
        }
    };

    getIsVesselOwner = () => {
        if (typeof window !== "undefined") {
            try {
                const status = secureStorage.getItem("IsVesselOwner") || false;
                return status;
            } catch (er) {
                return false;
            }
        }
        return "";
    };
    setIsVesselOwner = (status) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("IsVesselOwner", status);
        }
    };

    getUserId = () => {
        if (typeof window !== "undefined") {
            try {
                const userId = secureStorage.getItem("UserId") || false;
                return userId;
            } catch (er) {
                return false;
            }
        }
        return "";
    };
    setUserId = (userId) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("UserId", userId);
        }
    };

    getProfileImage = () => {
        if (typeof window !== "undefined") {
            try {
                const profileImage = secureStorage.getItem("ProfileImage") || false;
                return profileImage;
            } catch (er) {
                return false;
            }
        }
        return "";
    };
    setProfileImage = (profileImage) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("ProfileImage", profileImage);
        }
    };

    getFirstName = () => {
        if (typeof window !== "undefined") {
            try {
                const firstName = secureStorage.getItem("FirstName") || "";
                return firstName;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setFirstName = (firstName) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("FirstName", firstName);
        }
    };

    getLastName = () => {
        if (typeof window !== "undefined") {
            try {
                const lastName = secureStorage.getItem("LastName") || "";
                return lastName;
            } catch (er) {
                return "";
            }
        }
        return "";
    };
    setLastName = (lastName) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("LastName", lastName);
        }
    };

    getNotifications = () => {
        if (typeof window !== "undefined") {
            try {
                const notifications = secureStorage.getItem("Notifications") || false;
                return notifications;
            } catch (er) {
                return false;
            }
        }
        return "";
    };
    setNotifications = (notifications) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("Notifications", notifications);
        }
    };

    getMobileOutgoingCallInfo = () => {
        if (typeof window !== "undefined") {
            try {
                const mobileOutgoingCallInfo = secureStorage.getItem("MobileOutgoingCallInfo") || false;
                return mobileOutgoingCallInfo;
            } catch (er) {
                return false;
            }
        }
        return "";
    };
    setMobileOutgoingCallInfo = (mobileOutgoingCallInfo) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("MobileOutgoingCallInfo", mobileOutgoingCallInfo);
        }
    };

    getMobileIncomingCallInfo = () => {
        if (typeof window !== "undefined") {
            try {
                const mobileIncomingCallInfo = secureStorage.getItem("MobileIncomingCallInfo") || false;
                return mobileIncomingCallInfo;
            } catch (er) {
                return false;
            }
        }
        return "";
    };
    setMobileIncomingCallInfo = (mobileIncomingCallInfo) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("MobileIncomingCallInfo", mobileIncomingCallInfo);
        }
    };
    
    getOnlineUsersTemp = () => {
        if (typeof window !== "undefined") {
            try {
                const onlineUsersTemp = secureStorage.getItem("OnlineUsersTemp") || false;
                return onlineUsersTemp;
            } catch (er) {
                return false;
            }
        }
        return "";
    };
    setOnlineUsersTemp = (onlineUsersTemp) => {
        if (typeof window !== "undefined") {
            secureStorage.setItem("OnlineUsersTemp", onlineUsersTemp);
        }
    };

    clear = () => {
        sessionStorage.clear();
    };
}

const LocalStoreClass = new LocalStore();
export default LocalStoreClass;
