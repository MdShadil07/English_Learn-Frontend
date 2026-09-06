import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, ShieldCheck } from 'lucide-react';

interface CertificationData {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  isVerified: boolean;
}

interface EditCertificationsProps {
  certifications: CertificationData[];
  onAddCertification: () => void;
  onRemoveCertification: (index: number) => void;
  onUpdateCertification: (index: number, field: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditCertifications: React.FC<EditCertificationsProps> = ({
  certifications,
  onAddCertification,
  onRemoveCertification,
  onUpdateCertification,
  onSave,
  isSaving
}) => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center pb-3 border-b border-emerald-500/10">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
          Licenses & Certifications
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddCertification}
          className="text-[10px] font-black uppercase tracking-widest border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 h-8"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 text-slate-400 border rounded-2xl border-dashed border-emerald-500/20 bg-emerald-500/5 text-sm font-medium">
          <p>No certifications added yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <div key={index} className="p-6 border border-emerald-500/20 rounded-2xl bg-emerald-500/5 relative shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl"
                onClick={() => onRemoveCertification(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => onUpdateCertification(index, 'name', e.target.value)}
                    placeholder="Ex: IELTS, TOEFL, AWS Certified Solutions Architect"
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Issuing Organization</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => onUpdateCertification(index, 'issuer', e.target.value)}
                    placeholder="Ex: Cambridge Assessment"
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Credential ID</Label>
                  <Input
                    value={cert.credentialId || ''}
                    onChange={(e) => onUpdateCertification(index, 'credentialId', e.target.value)}
                    placeholder="Credential ID"
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Issue Date</Label>
                  <Input
                    type="date"
                    value={cert.issueDate || ''}
                    onChange={(e) => onUpdateCertification(index, 'issueDate', e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Expiration Date</Label>
                  <Input
                    type="date"
                    value={cert.expiryDate || ''}
                    onChange={(e) => onUpdateCertification(index, 'expiryDate', e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Credential URL</Label>
                  <Input
                    type="url"
                    value={cert.credentialUrl || ''}
                    onChange={(e) => onUpdateCertification(index, 'credentialUrl', e.target.value)}
                    placeholder="https://..."
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
                  />
                </div>
              </div>

              {cert.isVerified && (
                <div className="mt-4 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl w-fit shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Credential</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
        >
          {isSaving ? 'Updating...' : 'Update certifications'}
        </Button>
      </div>
    </div>
  );
};

export default EditCertifications;
