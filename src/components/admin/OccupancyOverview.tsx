import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Home, Users, DoorOpen } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Flat {
  id: string;
  flatNumber: string;
  ownerName: string;
  monthlyMaintenance: number;
  user: {
    id: string;
    name: string;
  } | null;
}

interface BlockStats {
  name: string;
  totalFlats: number;
  occupied: number;
  vacant: number;
}

const OccupancyOverview = () => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFlats();
  }, []);

  const fetchFlats = async () => {
    try {
      setIsLoading(true);
      // This endpoint needs to be created to get all flats
      const response = await api.get('/flats/all');
      setFlats(response.data);
    } catch (error) {
      console.error('Error fetching flats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch flat data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group flats by block (extract block from flat number)
  const getBlockFromFlatNumber = (flatNumber: string): string => {
    // Assumes flat numbers like "A-101", "B-205", etc.
    const match = flatNumber.match(/^([A-Z])/);
    return match ? `Block ${match[1]}` : 'Other';
  };

  const blockStats: BlockStats[] = (() => {
    const blocks = new Map<string, BlockStats>();
    
    flats.forEach(flat => {
      const blockName = getBlockFromFlatNumber(flat.flatNumber);
      
      if (!blocks.has(blockName)) {
        blocks.set(blockName, {
          name: blockName,
          totalFlats: 0,
          occupied: 0,
          vacant: 0,
        });
      }
      
      const stats = blocks.get(blockName)!;
      stats.totalFlats++;
      
      if (flat.user) {
        stats.occupied++;
      } else {
        stats.vacant++;
      }
    });
    
    return Array.from(blocks.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  })();

  const totalFlats = flats.length;
  const totalOccupied = flats.filter(f => f.user).length;
  const totalVacant = flats.filter(f => !f.user).length;
  const occupancyRate = totalFlats > 0 
    ? ((totalOccupied / totalFlats) * 100).toFixed(1) 
    : '0.0';

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading occupancy data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalFlats}</p>
                <p className="text-sm text-muted-foreground">Total Flats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalOccupied}</p>
                <p className="text-sm text-muted-foreground">Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <DoorOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVacant}</p>
                <p className="text-sm text-muted-foreground">Vacant</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{occupancyRate}%</p>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Block-wise breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Block-wise Occupancy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {blockStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No blocks found. Add flats to see occupancy data.
            </div>
          ) : (
            <div className="space-y-4">
              {blockStats.map((block) => {
                const occupancyPercent = block.totalFlats > 0
                  ? (block.occupied / block.totalFlats) * 100
                  : 0;
                return (
                  <div key={block.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{block.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                          {block.occupied} Occupied
                        </Badge>
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                          {block.vacant} Vacant
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {block.totalFlats} total flats • {occupancyPercent.toFixed(1)}% occupied
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OccupancyOverview;