import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FavoriteMessage {
    id: bigint;
    message: string;
    category: TextCategory;
}
export interface Entry {
    id: bigint;
    content: string;
    timestamp: bigint;
}
export interface UserProfile {
    status?: RelationshipStatus;
    nickname?: string;
    isPremium: boolean;
}
export enum RelationshipStatus {
    healing = "healing",
    married = "married",
    single = "single",
    inRelationship = "inRelationship"
}
export enum TextCategory {
    boundaries = "boundaries",
    flirty = "flirty",
    missingYou = "missingYou",
    pullAway = "pullAway",
    apology = "apology"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFavorite(category: TextCategory, message: string): Promise<void>;
    addJournalEntry(content: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkPremiumStatus(): Promise<boolean>;
    deleteFavorite(favoriteId: bigint): Promise<boolean>;
    deleteJournalEntry(entryId: bigint): Promise<boolean>;
    getAllPremiumUsers(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Array<FavoriteMessage>>;
    getJournalEntries(): Promise<Array<Entry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPremiumUser(): Promise<void>;
    updateNickname(nickname: string): Promise<void>;
    updateStatus(status: RelationshipStatus): Promise<void>;
}
