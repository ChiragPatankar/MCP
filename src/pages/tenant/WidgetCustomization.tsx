import React, { useState } from 'react';
import { Palette, Monitor, MessageSquare, Copy, Check, Code } from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WidgetCustomizationPage: React.FC = () => {
  // Widget configuration state
  const [widgetConfig, setWidgetConfig] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#FFFFFF',
    position: 'right',
    welcomeMessage: 'Hello! How can I help you today?',
    botName: 'Support Bot',
    autoOpen: false,
    logoUrl: '',
  });

  const [copied, setCopied] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setWidgetConfig({
        ...widgetConfig,
        [name]: target.checked,
      });
    } else {
      setWidgetConfig({
        ...widgetConfig,
        [name]: value,
      });
    }
  };

  // Generate embed code
  const generateEmbedCode = () => {
    return `<!-- MCP Chat Widget -->
<script>
  window.mcpChatConfig = {
    apiKey: "YOUR_API_KEY",
    primaryColor: "${widgetConfig.primaryColor}",
    secondaryColor: "${widgetConfig.secondaryColor}",
    position: "${widgetConfig.position}",
    welcomeMessage: "${widgetConfig.welcomeMessage}",
    botName: "${widgetConfig.botName}",
    autoOpen: ${widgetConfig.autoOpen},
    logoUrl: "${widgetConfig.logoUrl}"
  };
</script>
<script src="https://cdn.mcpchat.com/widget.js" async></script>`;
  };

  // Copy embed code to clipboard
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Widget Customization</h2>
          <p className="text-muted-foreground mt-1">Customize how your chat widget looks and behaves.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customization Settings */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Appearance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <div className="flex">
                      <input
                        type="color"
                        name="primaryColor"
                        value={widgetConfig.primaryColor}
                        onChange={handleInputChange}
                        className="h-10 w-10"
                      />
                      <input
                        type="text"
                        name="primaryColor"
                        value={widgetConfig.primaryColor}
                        onChange={handleInputChange}
                        className="ml-2 flex-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                    <div className="flex">
                      <input
                        type="color"
                        name="secondaryColor"
                        value={widgetConfig.secondaryColor}
                        onChange={handleInputChange}
                        className="h-10 w-10"
                      />
                      <input
                        type="text"
                        name="secondaryColor"
                        value={widgetConfig.secondaryColor}
                        onChange={handleInputChange}
                        className="ml-2 flex-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    name="position"
                    value={widgetConfig.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (optional)</label>
                  <input
                    type="text"
                    name="logoUrl"
                    value={widgetConfig.logoUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 64x64px</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Behavior</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bot Name</label>
                  <input
                    type="text"
                    name="botName"
                    value={widgetConfig.botName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
                  <textarea
                    name="welcomeMessage"
                    value={widgetConfig.welcomeMessage}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoOpen"
                    name="autoOpen"
                    checked={widgetConfig.autoOpen}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="autoOpen" className="ml-2 block text-sm text-gray-700">
                    Auto-open chat window after 5 seconds
                  </label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Embed Code</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                    {generateEmbedCode()}
                  </pre>
                  <button
                    onClick={copyEmbedCode}
                    className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Add this code snippet to your website's HTML, just before the closing <code>&lt;/body&gt;</code> tag.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview Panel */}
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle>Live Preview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-100 rounded-lg h-[500px] overflow-hidden">
                    {/* Mock website background */}
                    <div className="absolute inset-0 p-4">
                      <div className="h-8 w-full bg-gray-200 rounded mb-4"></div>
                      <div className="h-32 w-full bg-gray-200 rounded mb-4"></div>
                      <div className="h-12 w-3/4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
                      <div className="h-24 w-full bg-gray-200 rounded"></div>
                    </div>
                    
                    {/* Chat widget button */}
                    <div 
                      className={`absolute bottom-4 ${widgetConfig.position === 'right' ? 'right-4' : 'left-4'}`}
                      style={{ zIndex: 10 }}
                    >
                      <button 
                        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                      >
                        <MessageSquare className="h-6 w-6" style={{ color: widgetConfig.secondaryColor }} />
                      </button>
                    </div>
                    
                    {/* Chat widget panel (shown if autoOpen is true) */}
                    {widgetConfig.autoOpen && (
                      <div 
                        className={`absolute bottom-20 ${widgetConfig.position === 'right' ? 'right-4' : 'left-4'} w-72 bg-white rounded-lg shadow-xl overflow-hidden`}
                        style={{ zIndex: 10 }}
                      >
                        <div className="p-4" style={{ backgroundColor: widgetConfig.primaryColor }}>
                          <div className="flex items-center">
                            {widgetConfig.logoUrl ? (
                              <img src={widgetConfig.logoUrl} alt="Logo" className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageSquare className="h-4 w-4" style={{ color: widgetConfig.secondaryColor }} />
                              </div>
                            )}
                            <p className="ml-2 font-medium" style={{ color: widgetConfig.secondaryColor }}>
                              {widgetConfig.botName}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto">
                          <div className="inline-block bg-gray-100 rounded-lg p-3 mb-4 max-w-[80%]">
                            <p className="text-sm text-gray-800">{widgetConfig.welcomeMessage}</p>
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <div className="flex">
                            <input 
                              type="text" 
                              placeholder="Type your message..." 
                              className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none"
                              readOnly
                            />
                            <button 
                              className="px-4 py-2 rounded-r-md"
                              style={{ backgroundColor: widgetConfig.primaryColor, color: widgetConfig.secondaryColor }}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 text-center">This is a preview of how your chat widget will appear on your website.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default WidgetCustomizationPage;