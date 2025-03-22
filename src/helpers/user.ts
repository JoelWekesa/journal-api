export class UserHelper {
    userId: string;

    getUser() {
        return this.userId;
    }

    setUser(userId: string) {
        this.userId = userId;
    }
}