class UserDTO {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;

    constructor(username: string, firstname: string, lastname: string, email: string, password: string, role: string) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    static fromJSON(json: Partial<UserDTO>): UserDTO {
        return new UserDTO(json.username, json.firstname, json.lastname, json.email, json.password, json.role);
    }
}

export default UserDTO;
