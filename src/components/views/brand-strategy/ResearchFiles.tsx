
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Trash2, Download } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ResearchFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  description: string;
}

const ResearchFiles = () => {
  const [files, setFiles] = useState<ResearchFile[]>([
    {
      id: "1",
      name: "Market Research 2025.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2025-04-15",
      description: "Comprehensive market analysis for Q2 2025"
    },
    {
      id: "2",
      name: "Customer Survey Results.xlsx",
      type: "Excel",
      size: "1.8 MB",
      uploadDate: "2025-04-10",
      description: "Results from the March 2025 customer satisfaction survey"
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      const newFile: ResearchFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.split("/")[1].toUpperCase(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        description: "Click to add description"
      };
      setFiles([...files, newFile]);
    }
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Research Files</CardTitle>
            <CardDescription>Upload and manage research documents and files</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button asChild className="cursor-pointer">
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </span>
              </Button>
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-purple-100">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{file.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <span>{file.type}</span>
                    <span>•</span>
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Uploaded {file.uploadDate}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete File</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this file? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(file.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          
          {files.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No files uploaded</h3>
              <p className="text-gray-500">Upload research files to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchFiles;
