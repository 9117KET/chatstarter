import { v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

// List all direct messages for the authenticated user
export const list = authenticatedQuery({
    handler: async (ctx) => {
        // Query the database for direct message memberships of the current user
        const directMessages = await ctx.db
        .query("directMessageMembers")
        .withIndex("by_user", (q) => q.eq("users", ctx.user._id))
        .collect();
        
        // Retrieve full direct message details for each membership
        return await Promise.all(
            directMessages.map((dm) => getDirectMessage(ctx, dm.directMessage))
        );
    },
});

// Get a specific direct message if the user is a member
export const get = authenticatedQuery({
  args: {
    id: v.id("directMessages"),
  },
  handler: async (ctx, { id }) => {
    // Check if the user is a member of the direct message
    const member = await ctx.db
      .query("directMessageMembers")
      .withIndex("by_direct_message_user", (q) =>
        q.eq("directMessage", id).eq("users", ctx.user._id)
      )
      .first();
    
    // Throw an error if the user is not a member
    if (!member) {
      throw new Error("You are not a member of this direct message.");
    }
    
    // Retrieve and return the direct message details
    return getDirectMessage(ctx, id);
  },
});

// Create a new direct message with another user
export const create = authenticatedMutation({
    args: {
        username: v.string(),
    },
    handler: async (ctx, { username }) => {
        // Find the user by username
        const user = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", username))
        .first();
        
        // Throw an error if the user does not exist
        if (!user) {
            throw new Error("User does not exist.");
        }
        
        // Get all direct messages for the current user
        const directMessagesForCurrentUser = await ctx.db 
        .query("directMessageMembers")
        .withIndex("by_user", (q) => q.eq("users", ctx.user._id))
        .collect();
        
        // Get all direct messages for the other user
        const directMessagesForOtherUser = await ctx.db 
        .query("directMessageMembers")
        .withIndex("by_user", (q) => q.eq("users", user._id))
        .collect();
        
        // Check if a direct message already exists between the two users
        const directMessage = directMessagesForCurrentUser.find((dm) =>
            directMessagesForOtherUser.find(
                (dm2) => dm2.directMessage === dm.directMessage
            )
        );
        
        if (directMessage) {
            return getDirectMessage(ctx, directMessage.directMessage);
        }
        
        // Create a new direct message
        const newDirectMessage = await ctx.db.insert("directMessages", {});
        
        // Insert the new direct message membership for the current user
        await ctx.db.insert("directMessageMembers", {
            users: ctx.user._id,
            directMessage: newDirectMessage,
        });
        
        // Insert the new direct message membership for the other user
        await ctx.db.insert("directMessageMembers", {
            users: user._id,
            directMessage: newDirectMessage,
        });
        
        return newDirectMessage;
    },
});

const getDirectMessage = async (ctx: QueryCtx & {user: Doc<"users">}, id: Id<"directMessages">) => {
    const dm = await ctx.db.get(id);
    if(!dm){
        throw new Error("Direct message does not exist.");
    }
    const otherMember = await ctx.db
      .query("directMessageMembers")
      .withIndex("by_direct_message", (q) => q.eq("directMessage", id))
      .filter((q) => q.neq(q.field("users"), ctx.user._id))
      .first();
    if (!otherMember){
        throw new Error("Direct message has no other members.");
    }
    const user = await ctx.db.get(otherMember.users);
    if(!user){
        throw new Error("Other member does not exist.");
    }
    return {
        ...dm,
        user,
    };
}