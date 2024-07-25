"use client";

// Import necessary libraries and components
import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import ReactMarkDown from "react-markdown";
import { Heading } from "@/components/ui/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { formSchema } from "./constants";
import toast from "react-hot-toast";

// Define ChatMessage interface
interface ChatMessage {
    role: string;
    content: string;
}

const CodePage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // Initialize the form with react-hook-form and zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isloading = form.formState.isSubmitting;

    // Function to handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Create a user message object from the form values
            const userMessage: ChatMessage = {
                role: "user",
                content: values.prompt,
            };
            // Combine the new user message with existing messages
            const newMessages = [...messages, userMessage];

            // Send the messages to the backend API
            const response = await axios.post("/api/code", {
                messages: newMessages,
            });

            // Update the messages state with the user's message and the response from the API
            setMessages((current) => [...current, userMessage, response.data.choices[0].message]);

            // Reset the form
            form.reset();
        } catch (error: any) {
            // Handle errors
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            // Refresh the router
            router.refresh();
        }
    }

    return (
        <div>
            {/* Heading component */}
            <Heading
                title="Code Generation"
                description="Generate code using descriptive text."
                icon={Code}
                iconColor="text-green-700"
                bgColor="bg-violet-700/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="
                            rounded-lg
                            border
                            w-full
                            p-4
                            px-3
                            md:px-6
                            focus-within:shadow-sm
                            grid
                            grid-cols-12
                            gap-2
                        "
                        >
                            {/* Input field for the prompt */}
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isloading}
                                                placeholder="Simple toggle button using react hooks."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {/* Generate button */}
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isloading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {/* Loader component */}
                    {isloading && (
                        <div className="p-8 rounded-lg w-full flex item-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {/* Empty state message */}
                    {messages.length === 0 && !isloading && (
                        <Empty label="No conversation started."/>
                    )}
                    {/* Display messages */}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message, index) => (
                            <div 
                            key={index}
                            className={cn(
                                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                            )}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkDown
                                    components={{
                                        pre: ({ node, ...props }) => (
                                            <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                <pre {...props}/>
                                            </div>
                                        ),
                                        code: ({ node, ...props }) => (
                                            <code className="bg-black/10 rounded-lg p-1 " {...props}/>
                                        )
                                    }}
                                    className="text-sm overflow-hidden leading-7"
                                >
                                    {message.content || ""}
                                </ReactMarkDown>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodePage;
