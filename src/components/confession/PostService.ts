
import { supabase } from '@/integrations/supabase/client';
import { Reaction } from '@/types/user';

// New POST services for handling the restructured database

// Interface for the create post payload
interface CreatePostPayload {
  title: string;
  content: string;
  topic?: string;
  authorId: string;
}

// Service for confession posts
export const ConfessionPostService = {
  // Fetch confession posts with pagination and filtering
  async getPosts(page: number, pageSize: number, topic?: string, sortBy: string = 'new') {
    try {
      let query = supabase
        .from('posts_confession')
        .select(`
          id,
          title,
          content,
          topic,
          author_id,
          like_count,
          heart_count,
          laugh_count,
          wow_count,
          sad_count,
          angry_count,
          chatroom_id,
          created_at,
          profiles(display_name, university)
        `);
      
      // Apply topic filter if provided
      if (topic && topic !== 'all') {
        query = query.ilike('topic', topic);
      }
      
      // Apply sorting
      if (sortBy === 'new') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'hot') {
        // For 'hot', we're ordering by a combination of recency and reaction counts
        // This is a simplified approximation - in a real app, you might use a more sophisticated algorithm
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Format the posts
      const formattedPosts = data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        topic: post.topic,
        authorId: post.author_id,
        createdAt: post.created_at,
        reactions: {
          like: post.like_count || 0,
          heart: post.heart_count || 0,
          laugh: post.laugh_count || 0,
          wow: post.wow_count || 0,
          sad: post.sad_count || 0,
          angry: post.angry_count || 0
        } as Reaction,
        commentCount: 0, // This would need to be fetched separately if needed
        chatroomId: post.chatroom_id
      }));
      
      return { posts: formattedPosts, count };
    } catch (error) {
      console.error('Error fetching confession posts:', error);
      throw error;
    }
  },
  
  // Create a new confession post
  async createPost(postData: CreatePostPayload) {
    try {
      const { data, error } = await supabase
        .from('posts_confession')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            topic: postData.topic,
            author_id: postData.authorId
          }
        ])
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Error creating confession post:', error);
      throw error;
    }
  },
  
  // Update reaction counts
  async addReaction(postId: string, reactionType: string, userId: string) {
    try {
      const columnName = `${reactionType}_count`;
      
      // First, check if the user has already reacted
      const { data: existingReaction, error: checkError } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .eq('reaction_type', reactionType)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If the user hasn't reacted yet, record the reaction and update the count
      if (!existingReaction) {
        // Insert the reaction
        const { error: insertError } = await supabase
          .from('post_reactions')
          .insert([
            {
              post_id: postId,
              user_id: userId,
              reaction_type: reactionType
            }
          ]);
        
        if (insertError) throw insertError;
        
        // Increment the reaction count
        const { error: updateError } = await supabase
          .from('posts_confession')
          .update({ [columnName]: supabase.rpc('increment', { inc: 1 }) })
          .eq('id', postId);
        
        if (updateError) throw updateError;
      }
      
      // Return the updated post
      const { data: updatedPost, error: fetchError } = await supabase
        .from('posts_confession')
        .select('like_count, heart_count, laugh_count, wow_count, sad_count, angry_count')
        .eq('id', postId)
        .single();
      
      if (fetchError) throw fetchError;
      
      return {
        like: updatedPost.like_count || 0,
        heart: updatedPost.heart_count || 0,
        laugh: updatedPost.laugh_count || 0,
        wow: updatedPost.wow_count || 0,
        sad: updatedPost.sad_count || 0,
        angry: updatedPost.angry_count || 0
      } as Reaction;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }
};

// Similar services for other post types
export const ForumPostService = {
  // Implementation would be similar to ConfessionPostService but for 'posts_forum' table
};

export const CampusCommunityPostService = {
  // Implementation for 'posts_campus_community' table
};

export const NationwideCommunityPostService = {
  // Implementation for 'posts_nationwide_community' table
};
