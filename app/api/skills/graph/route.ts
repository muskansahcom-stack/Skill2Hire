import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const focusSkillId = searchParams.get('focus');

    const graphData = db.getSkillGraph();

    if (category && category !== 'All') {
      const matchingSkillIds = new Set(
        graphData.nodes
          .filter(n => n.type === 'skill' && n.category?.toLowerCase() === category.toLowerCase())
          .map(n => n.id)
      );

      const filteredEdges = graphData.edges.filter(
        e => matchingSkillIds.has(e.source) || matchingSkillIds.has(e.target)
      );

      const connectedNodeIds = new Set<string>();
      filteredEdges.forEach(e => {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
      });
      matchingSkillIds.forEach(id => connectedNodeIds.add(id));

      const filteredNodes = graphData.nodes.filter(n => connectedNodeIds.has(n.id));

      return NextResponse.json({
        success: true,
        data: {
          nodes: filteredNodes,
          edges: filteredEdges,
          categories: graphData.categories,
          summary: {
            ...graphData.summary,
            totalSkills: filteredNodes.filter(n => n.type === 'skill').length,
            totalRelationships: filteredEdges.length
          }
        }
      });
    }

    if (focusSkillId) {
      const connectedEdges = graphData.edges.filter(
        e => e.source === focusSkillId || e.target === focusSkillId
      );
      const connectedNodeIds = new Set<string>([focusSkillId]);
      connectedEdges.forEach(e => {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
      });

      const filteredNodes = graphData.nodes.filter(n => connectedNodeIds.has(n.id));

      return NextResponse.json({
        success: true,
        data: {
          nodes: filteredNodes,
          edges: connectedEdges,
          categories: graphData.categories,
          summary: {
            ...graphData.summary,
            totalSkills: filteredNodes.filter(n => n.type === 'skill').length,
            totalRelationships: connectedEdges.length
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: graphData
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate Global Skill Graph' },
      { status: 500 }
    );
  }
}
