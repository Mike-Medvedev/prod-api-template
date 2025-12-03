import type { User } from "@supabase/supabase-js";
import { AuthInvalidJwtError, UserNotFoundError } from "@/errors/errors";
import { supabaseClient } from "@/clients/supabase.client";

class AuthService {
  private readonly _authClient;
  constructor() {
    this._authClient = supabaseClient;
  }
  get client() {
    return this._authClient;
  }

  async validateToken(token: string): Promise<User> {
    const {
      data: { user },
      error,
    } = await this._authClient.getUser(token);
    if (error) {
      throw new AuthInvalidJwtError(error.message || "Invalid or expired token");
    }

    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }
}

const authService = new AuthService();
export default authService;
