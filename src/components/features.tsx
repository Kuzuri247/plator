import { Card } from "./ui/card";
import { Sparkles, Calendar, Type, Image } from "lucide-react";


export function Features() {
  return (
    <>
      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <Card className="bg-gradient-card backdrop-blur-sm border-white/20 p-6 hover:shadow-glow transition-smooth">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Image className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Meme Templates</h3>
          <p className="text-muted-foreground">
            Create viral memes with our extensive library of customizable
            templates
          </p>
        </Card>

        <Card className="bg-gradient-card backdrop-blur-sm border-white/20 p-6 hover:shadow-glow transition-smooth">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Type className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Stylish Text</h3>
          <p className="text-muted-foreground">
            Add beautiful typography and text effects to your images
            effortlessly
          </p>
        </Card>

        <Card className="bg-gradient-card backdrop-blur-sm border-white/20 p-6 hover:shadow-glow transition-smooth">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Scheduling</h3>
          <p className="text-muted-foreground">
            Smart AI analyzes your audience to schedule posts at optimal
            times
          </p>
        </Card>
      </div>
    </>
  );
}

