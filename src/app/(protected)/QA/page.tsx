'use client'
import useProjects from "~/hooks/use-projects"
import {api} from "~/trpc/react";
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import AskQuestion from "../dashboard/ask-question";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-refrences";


const QApage=()=>{
    const {projectid} = useProjects();
    const {data: questions} = api.project.getQuestions.useQuery({
        projectId: projectid || '',
    });
    const [questionIdx, setQuestionIdx] = React.useState<number | null>(null);
    const question = questions?.[questionIdx || 0];

    return(
        <Sheet>
            <AskQuestion />
            <div className="h-4"></div>
                <h1>Saved Questions</h1>
               <div className="h-2"></div>
                <div className="flex flex-col gap-2">
                    {questions?.map((question, index) => {
                    return<React.Fragment key={question.id}>
                       <SheetTrigger onClick={() => setQuestionIdx(index)}>
                    <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
    <img className="rounded-full " height={30} width={30} src={question.user.imageUrl??""}/>
    <div className="text-left flex flex-col">
        <div className="items-center gap-2">
            <p className="text-gray-700 line-clamp-1 text-lg font-medium">{question.question} </p>
            <span className="text-xs text-gray-500 whitespace-nowrap">{question.createdAt.toLocaleString()}</span>
        </div>
                        </div>
    </div>                       </SheetTrigger>
                    </React.Fragment>
})}
</div>
                
            
            {question &&(
                <SheetContent className="sm:max-w-[80vw] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <MDEditor.Markdown source={question.answer} />
                        <CodeReferences filesReferences={(question.fileReferences)as any} />
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}
export default QApage;