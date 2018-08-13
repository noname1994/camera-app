module.exports = {

    infoLogin: (obj) => {
        return {
            email: obj.email,
            password: obj.password
        }
    },

    
    infoCreate: (obj)=>{

    },

    infoUpdate: (obj)=>{

    },

    infoResponse: (obj)=>{
        return {
            id: obj.id,
            email: obj.email,
            fullname: obj.fullname,
            phone_number: obj.phone_number,
            address: obj.address,
            fb_address: obj.fb_address,
            zalo_address: obj.zalo_address
        }
    }
}