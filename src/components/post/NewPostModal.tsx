
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, ChevronRight, Users, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define the schemas for each step
const step1Schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" })
});

const step2ForumSchema = z.object({
  chatroomName: z.string().min(1, { message: "Chatroom name is required" }),
  topic: z.string().min(1, { message: "Topic is required" }),
  blockedUsers: z.string().optional()
});

const step2CommunitySchema = z.object({
  topic: z.string().min(1, { message: "Topic is required" }),
  blockedUsers: z.string().optional()
});

type NewPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPost: (postData: any) => void;
};

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onPost }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [postType, setPostType] = useState<'forum' | 'confession' | 'campus' | 'nationwide'>('forum');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine post type based on current route
  useEffect(() => {
    if (location.pathname.includes('forum')) {
      setPostType('forum');
    } else if (location.pathname.includes('confession')) {
      setPostType('confession');
    } else if (location.pathname.includes('campus')) {
      setPostType('campus');
    } else if (location.pathname.includes('nationwide')) {
      setPostType('nationwide');
    }
  }, [location]);
  
  // Check if this is a forum/confession post or community post
  const isForumOrConfession = postType === 'forum' || postType === 'confession';
  
  // Step 1 form
  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      title: "",
      content: ""
    }
  });

  // Step 2 forum/confession form
  const step2ForumForm = useForm<z.infer<typeof step2ForumSchema>>({
    resolver: zodResolver(step2ForumSchema),
    defaultValues: {
      chatroomName: user?.displayName ? `${user.displayName}'s chatroom` : "New chatroom",
      topic: "",
      blockedUsers: ""
    }
  });

  // Step 2 community form
  const step2CommunityForm = useForm<z.infer<typeof step2CommunitySchema>>({
    resolver: zodResolver(step2CommunitySchema),
    defaultValues: {
      topic: "",
      blockedUsers: ""
    }
  });

  // Topic options based on post type
  const getTopicOptions = () => {
    switch (postType) {
      case 'forum':
      case 'confession':
        return [
          { id: 'classes', label: 'Classes' },
          { id: 'embarrassing', label: 'Embarrassing' },
          { id: 'money', label: 'Money' },
          { id: 'relationships', label: 'Relationships' },
          { id: 'campus', label: 'Campus' }
        ];
      case 'campus':
        return [
          { id: 'male', label: 'Male' },
          { id: 'female', label: 'Female' },
          { id: 'l', label: 'L' },
          { id: 'g', label: 'G' },
          { id: 'b', label: 'B' },
          { id: 't', label: 'T' },
          { id: 'housing', label: 'Housing' },
          { id: 'study', label: 'Study' },
          { id: 'campus', label: 'Campus' }
        ];
      case 'nationwide':
        return [
          { id: 'education', label: 'Education' },
          { id: 'events', label: 'Events' },
          { id: 'sports', label: 'Sports' },
          { id: 'studentLife', label: 'Student Life' },
          { id: 'career', label: 'Career' },
          { id: 'housing', label: 'Housing' },
          { id: 'travel', label: 'Travel' }
        ];
      default:
        return [];
    }
  };

  const handleStep1Submit = (data: z.infer<typeof step1Schema>) => {
    setStep(2);
  };

  const handleStep2Submit = async (data: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine data from step 1 and step 2
      const step1Data = step1Form.getValues();
      
      // Prepare the post data
      let postData = {
        title: step1Data.title,
        content: step1Data.content,
        author_id: user.id,
        topic: data.topic,
        post_type: postType
      };

      let result;
      
      // Insert into the posts table, setting post_type appropriately
      result = await supabase
        .from('posts')
        .insert(postData)
        .select();

      if (result?.error) {
        throw result.error;
      }

      // Create chatroom for forum and confession posts
      if (isForumOrConfession && result?.data?.[0]?.id) {
        const postId = result.data[0].id;
        
        // Create chatroom
        const chatroomResult = await supabase
          .from('chatrooms')
          .insert({
            name: data.chatroomName || step1Data.title,
            owner_id: user.id,
            post_id: postId,
            is_private: false,
          })
          .select();
        
        if (chatroomResult.error) {
          console.error("Error creating chatroom:", chatroomResult.error);
        } else if (chatroomResult.data && chatroomResult.data[0]) {
          // Add owner as member
          await supabase
            .from('chatroom_members')
            .insert({
              chatroom_id: chatroomResult.data[0].id,
              user_id: user.id,
            });
            
          // Create initial message with post content
          await supabase
            .from('messages')
            .insert({
              sender_id: user.id,
              content: step1Data.content,
              chatroom_id: chatroomResult.data[0].id,
            });
        }
      }
      
      // Show success message
      toast({
        title: "Post created successfully",
        description: isForumOrConfession 
          ? "Your post and chatroom have been created."
          : "Your post has been published.",
      });
      
      // Call the onPost callback with the created data
      onPost(postData);
      
      // Close the modal
      onClose();
      
      // Reset forms and step
      step1Form.reset();
      step2ForumForm.reset();
      step2CommunityForm.reset();
      setStep(1);
      
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error Creating Post",
        description: error.message || "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Create New Post" : "Post Details"}
          </DialogTitle>
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        {step === 1 ? (
          <Form {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
              <FormField
                control={step1Form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Add a title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={step1Form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What's on your mind?" 
                        className="min-h-[120px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        ) : (
          isForumOrConfession ? (
            <Form {...step2ForumForm}>
              <form onSubmit={step2ForumForm.handleSubmit(handleStep2Submit)} className="space-y-4">
                <FormField
                  control={step2ForumForm.control}
                  name="chatroomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chatroom Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={step2ForumForm.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getTopicOptions().map(topic => (
                            <SelectItem key={topic.id} value={topic.id}>
                              {topic.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={step2ForumForm.control}
                  name="blockedUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blocked Users</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter usernames separated by commas" 
                          {...field} 
                          className="pr-10"
                        />
                      </FormControl>
                      <div className="absolute right-3 top-9">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="sm:w-1/2"
                    type="button"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="sm:w-1/2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <Form {...step2CommunityForm}>
              <form onSubmit={step2CommunityForm.handleSubmit(handleStep2Submit)} className="space-y-4">
                <FormField
                  control={step2CommunityForm.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getTopicOptions().map(topic => (
                            <SelectItem key={topic.id} value={topic.id}>
                              {topic.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={step2CommunityForm.control}
                  name="blockedUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blocked Users</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter usernames separated by commas" 
                          {...field} 
                          className="pr-10"
                        />
                      </FormControl>
                      <div className="absolute right-3 top-9">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="sm:w-1/2"
                    type="button"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="sm:w-1/2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewPostModal;
