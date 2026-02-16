import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // User profile types
  public type RelationshipStatus = { #single; #inRelationship; #healing; #married };

  public type UserProfile = {
    status : ?RelationshipStatus;
    nickname : ?Text;
    isPremium : Bool;
  };

  module Journal {
    public type Entry = {
      id : Nat;
      timestamp : Nat;
      content : Text;
    };
    public func compare(entry1 : Entry, entry2 : Entry) : Order.Order {
      if (entry1.id < entry2.id) { #less } else if (entry1.id > entry2.id) { #greater } else { #equal };
    };
  };

  public type TextCategory = { #pullAway; #flirty; #apology; #missingYou; #boundaries };

  public type FavoriteMessage = {
    id : Nat;
    category : TextCategory;
    message : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Stable storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let favorites = Map.empty<Principal, List.List<FavoriteMessage>>();
  let journals = Map.empty<Principal, List.List<Journal.Entry>>();

  var nextFavoriteId = 0;
  var nextJournalId = 0;

  // REQUIRED PROFILE API FUNCTIONS
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // USER PROFILE
  public shared ({ caller }) func updateStatus(status : RelationshipStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update status");
    };
    let existingProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { { status = null; nickname = null; isPremium = false } };
    };
    let newProfile : UserProfile = {
      status = ?status;
      nickname = existingProfile.nickname;
      isPremium = existingProfile.isPremium;
    };
    userProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func updateNickname(nickname : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update nickname");
    };
    let existingProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { { status = null; nickname = null; isPremium = false } };
    };
    let newProfile : UserProfile = {
      status = existingProfile.status;
      nickname = ?nickname;
      isPremium = existingProfile.isPremium;
    };
    userProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func setPremiumUser() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade to premium");
    };
    let existingProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { { status = null; nickname = null; isPremium = false } };
    };
    let newProfile : UserProfile = {
      status = existingProfile.status;
      nickname = existingProfile.nickname;
      isPremium = true;
    };
    userProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func checkPremiumStatus() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check premium status");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.isPremium };
      case (null) { false };
    };
  };

  // TEXT SOFTLY FAVORITES
  public shared ({ caller }) func addFavorite(category : TextCategory, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };
    let isPremium = switch (userProfiles.get(caller)) {
      case (?profile) { profile.isPremium };
      case (null) { false };
    };

    if (not isPremium) {
      Runtime.trap("Premium users only. Please upgrade to add favorites.");
    };
    let favorite : FavoriteMessage = {
      id = nextFavoriteId;
      category;
      message;
    };
    nextFavoriteId += 1;

    let currentFavorites = switch (favorites.get(caller)) {
      case (?favList) { favList };
      case (null) { List.empty<FavoriteMessage>() };
    };

    currentFavorites.add(favorite);
    favorites.add(caller, currentFavorites);
  };

  public query ({ caller }) func getFavorites() : async [FavoriteMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };
    switch (favorites.get(caller)) {
      case (?favList) { favList.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteFavorite(favoriteId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete favorites");
    };
    let currentFavorites = switch (favorites.get(caller)) {
      case (?favList) { favList };
      case (null) { List.empty<FavoriteMessage>() };
    };

    let filteredFavorites = currentFavorites.filter(func(fav) { fav.id != favoriteId });
    favorites.add(caller, filteredFavorites);
    true;
  };

  // JOURNAL ENTRIES
  public shared ({ caller }) func addJournalEntry(content : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add journal entries");
    };
    let isPremium = switch (userProfiles.get(caller)) {
      case (?profile) { profile.isPremium };
      case (null) { false };
    };

    if (not isPremium) {
      Runtime.trap("Premium users only. Please upgrade to add journal entries.");
    };
    let entry : Journal.Entry = {
      id = nextJournalId;
      timestamp = 0; // Timestamp generation should be handled in frontend/TypeScript
      content;
    };
    nextJournalId += 1;

    let currentEntries = switch (journals.get(caller)) {
      case (?entryList) { entryList };
      case (null) { List.empty<Journal.Entry>() };
    };

    currentEntries.add(entry);
    journals.add(caller, currentEntries);
    true;
  };

  public query ({ caller }) func getJournalEntries() : async [Journal.Entry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view journal entries");
    };
    switch (journals.get(caller)) {
      case (?entryList) {
        entryList.toArray().sort();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteJournalEntry(entryId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete journal entries");
    };
    let currentEntries = switch (journals.get(caller)) {
      case (?entryList) { entryList };
      case (null) { List.empty<Journal.Entry>() };
    };

    let filteredEntries = currentEntries.filter(func(entry) { entry.id != entryId });
    journals.add(caller, filteredEntries);
    true;
  };

  // ADMIN FUNCTIONS
  public query ({ caller }) func getAllPremiumUsers() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all premium users");
    };
    let filteredIter = userProfiles.entries().filter(
      func((_, profile)) { profile.isPremium }
    );
    filteredIter.map<(Principal, UserProfile), Principal>(func((principal, _)) { principal }).toArray();
  };
};
