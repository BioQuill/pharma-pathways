import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

export interface PatentInfo {
  patentNumber: string;
  title: string;
  expirationDate: string;
  type: 'composition' | 'method' | 'formulation' | 'use';
  status: 'active' | 'expiring-soon' | 'expired' | 'challenged';
  exclusivityEnd?: string;
  notes?: string;
}

interface PatentTimelineProps {
  moleculeName: string;
  patents: PatentInfo[];
  regulatoryExclusivity?: {
    type: string;
    endDate: string;
  }[];
}

export function PatentTimeline({ moleculeName, patents, regulatoryExclusivity }: PatentTimelineProps) {
  const getStatusColor = (status: PatentInfo['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'expiring-soon': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired': return 'bg-muted text-muted-foreground border-border';
      case 'challenged': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getTypeColor = (type: PatentInfo['type']) => {
    switch (type) {
      case 'composition': return 'bg-primary/20 text-primary';
      case 'method': return 'bg-secondary/20 text-secondary-foreground';
      case 'formulation': return 'bg-accent/20 text-accent-foreground';
      case 'use': return 'bg-chart-4/20 text-chart-4';
    }
  };

  const sortedPatents = [...patents].sort((a, b) => 
    new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Patent & Exclusivity Timeline - {moleculeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Visualization */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-4">
            {sortedPatents.map((patent, index) => (
              <div key={patent.patentNumber} className="relative pl-10">
                <div className={`absolute left-2 top-2 w-4 h-4 rounded-full border-2 ${
                  patent.status === 'active' ? 'bg-green-500 border-green-400' :
                  patent.status === 'expiring-soon' ? 'bg-yellow-500 border-yellow-400' :
                  patent.status === 'challenged' ? 'bg-red-500 border-red-400' :
                  'bg-muted border-border'
                }`} />
                <div className="bg-card border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">{patent.patentNumber}</span>
                      <Badge variant="outline" className={getTypeColor(patent.type)}>
                        {patent.type}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(patent.status)}>
                        {patent.status === 'expiring-soon' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {patent.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {patent.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={patent.status === 'expiring-soon' ? 'text-yellow-400 font-semibold' : ''}>
                        Expires: {patent.expirationDate}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{patent.title}</p>
                  {patent.notes && (
                    <p className="text-xs text-muted-foreground">{patent.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Exclusivity */}
        {regulatoryExclusivity && regulatoryExclusivity.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">Regulatory Exclusivity Periods</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {regulatoryExclusivity.map((excl, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{excl.type}</p>
                  <p className="font-semibold">{excl.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">Patent Cliff Analysis</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">
                {patents.filter(p => p.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Active Patents</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {patents.filter(p => p.status === 'expiring-soon').length}
              </p>
              <p className="text-xs text-muted-foreground">Expiring Soon</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {sortedPatents.length > 0 ? sortedPatents[sortedPatents.length - 1].expirationDate : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">Last Expiry</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
