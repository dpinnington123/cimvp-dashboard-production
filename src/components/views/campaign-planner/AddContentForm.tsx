import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { ContentItem } from '@/types/content';
import { sampleContentItems } from '@/data/sampleContent';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  format: z.string().min(1, 'Format is required'),
  type: z.enum(['driver', 'hero']),
  campaign: z.string().optional(),
  status: z.enum(['planned', 'draft', 'live']),
  objective: z.string().min(1, 'Objective is required'),
  audience: z.string().min(1, 'Audience is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface AddContentFormProps {
  onSubmit: (data: ContentItem) => void;
  onCancel: () => void;
}

const AddContentForm = ({ onSubmit, onCancel }: AddContentFormProps) => {
  // Get unique formats and campaigns from existing content
  const uniqueFormats = Array.from(new Set(sampleContentItems.map(item => item.format)));
  const uniqueCampaigns = Array.from(new Set(sampleContentItems
    .map(item => item.campaign)
    .filter(Boolean) as string[]
  ));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      format: '',
      type: 'driver',
      campaign: '',
      status: 'planned',
      objective: '',
      audience: '',
    },
  });

  const handleSubmit = (data: FormValues) => {
    const newContent: ContentItem = {
      id: crypto.randomUUID(),
      name: data.name,
      format: data.format,
      type: data.type,
      status: data.status,
      objective: data.objective,
      audience: data.audience,
      qualityScore: data.status === 'planned' ? 0 : Math.floor(Math.random() * 30) + 70,
      campaign: data.campaign || undefined,
    };
    onSubmit(newContent);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Content name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {uniqueFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="campaign"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {uniqueCampaigns.map((campaign) => (
                    <SelectItem key={campaign} value={campaign}>
                      {campaign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objective"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective</FormLabel>
              <FormControl>
                <Input placeholder="Content objective" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Input placeholder="Target audience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Content</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddContentForm;
