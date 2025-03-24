
import { supabase } from '@/integrations/supabase/client';

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
      const tableName = 'posts';
      
      let query = supabase
        .from(tableName)
        .select(`
          id,
          title,
          content,
          topic,
          author_id,
          created_at,
          chatroom_id,
          profiles(display_name, university)
        `)
        .eq('post_type', 'confession');
      
      // Apply topic filter if provided
      if (topic && topic !== 'all') {
        query = query.ilike('topic', topic);
      }
      
      // Apply sorting
      if (sortBy === 'new') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'hot') {
        // For 'hot', we're ordering by a combination of recency and reaction counts
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data) return { posts: [], count: 0 };
      
      // Get reaction counts for posts
      const postIds = data.map(post => post.id);
      const { data: reactionData, error: reactionError } = await supabase
        .from('reaction_counts')
        .select('*')
        .in('post_id', postIds);
      
      if (reactionError) throw reactionError;
      
      const reactionCountsMap = (reactionData || []).reduce((acc, item) => {
        acc[item.post_id] = {
          like: item.like_count || 0,
          heart: item.heart_count || 0,
          laugh: item.laugh_count || 0,
          wow: item.wow_count || 0,
          sad: item.sad_count || 0,
          angry: item.angry_count || 0
        };
        return acc;
      }, {});
      
      // Format the posts
      const formattedPosts = data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        topic: post.topic,
        authorId: post.author_id,
        authorName: post.profiles?.display_name || 'Anonymous',
        authorUniversity: post.profiles?.university || null,
        createdAt: post.created_at,
        reactions: reactionCountsMap[post.id] || {
          like: 0, heart: 0, laugh: 0, wow: 0, sad: 0, angry: 0
        },
        commentCount: 0, // This would need to be fetched separately if needed
        chatroomId: post.chatroom_id
      }));
      
      // Get total count for pagination
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .eq('post_type', 'confession')
        .ilike('topic', topic && topic !== 'all' ? topic : '%');
      
      return { posts: formattedPosts, count: count || 0 };
    } catch (error) {
      console.error('Error fetching confession posts:', error);
      throw error;
    }
  },
  
  // Create a new confession post
  async createPost(postData: CreatePostPayload) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            topic: postData.topic,
            author_id: postData.authorId,
            post_type: 'confession'
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
  
  // Add reaction to a post
  async addReaction(postId: string, reactionType: string, userId: string) {
    try {
      // First, check if the user has already reacted
      const { data: existingReaction, error: checkError } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .eq('reaction_type', reactionType)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If the user hasn't reacted yet, record the reaction
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
      }
      
      // Return the updated reaction counts
      const { data: reactionCounts, error: fetchError } = await supabase
        .from('reaction_counts')
        .select('*')
        .eq('post_id', postId)
        .single();
      
      if (fetchError) throw fetchError;
      
      return {
        like: reactionCounts.like_count || 0,
        heart: reactionCounts.heart_count || 0,
        laugh: reactionCounts.laugh_count || 0,
        wow: reactionCounts.wow_count || 0,
        sad: reactionCounts.sad_count || 0,
        angry: reactionCounts.angry_count || 0
      };
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }
};

// Similar services for other post types
export const ForumPostService = {
  // Implementation similar to ConfessionPostService but for forum posts
  async getPosts(page: number, pageSize: number, topic?: string, sortBy: string = 'new') {
    try {
      // Similar implementation to ConfessionPostService but with post_type = 'forum'
      const { posts, count } = await ConfessionPostService.getPosts(page, pageSize, topic, sortBy);
      return { posts, count };
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      throw error;
    }
  },
  
  async createPost(postData: CreatePostPayload) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            topic: postData.topic,
            author_id: postData.authorId,
            post_type: 'forum'
          }
        ])
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Error creating forum post:', error);
      throw error;
    }
  }
};

export const CampusCommunityPostService = {
  // Implementation for campus community posts
  async getPosts(page: number, pageSize: number, topic?: string, sortBy: string = 'new') {
    try {
      // Implementation would be similar to above but with post_type = 'campus_community'
      const { posts, count } = await ConfessionPostService.getPosts(page, pageSize, topic, sortBy);
      return { posts, count };
    } catch (error) {
      console.error('Error fetching campus community posts:', error);
      throw error;
    }
  },
  
  async createPost(postData: CreatePostPayload) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            topic: postData.topic,
            author_id: postData.authorId,
            post_type: 'campus_community'
          }
        ])
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Error creating campus community post:', error);
      throw error;
    }
  }
};

export const NationwideCommunityPostService = {
  // Implementation for nationwide community posts
  async getPosts(page: number, pageSize: number, topic?: string, sortBy: string = 'new') {
    try {
      // Implementation would be similar to above but with post_type = 'nationwide_community'
      const { posts, count } = await ConfessionPostService.getPosts(page, pageSize, topic, sortBy);
      return { posts, count };
    } catch (error) {
      console.error('Error fetching nationwide community posts:', error);
      throw error;
    }
  },
  
  async createPost(postData: CreatePostPayload) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            topic: postData.topic,
            author_id: postData.authorId,
            post_type: 'nationwide_community'
          }
        ])
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Error creating nationwide community post:', error);
      throw error;
    }
  }
};
